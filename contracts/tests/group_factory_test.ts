import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Test group creation",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const alice = accounts.get('wallet_1')!;

        let block = chain.mineBlock([
            Tx.contractCall('group-factory', 'create-group', [
                types.uint(1000000), // 1 STX
                types.uint(5)        // max 5 members
            ], alice.address)
        ]);

        assertEquals(block.receipts.length, 1);
        const groupId = block.receipts[0].result.expectOk();
        assertEquals(groupId, types.uint(1));

        // Verify group was created correctly
        const groupInfo = chain.callReadOnlyFn(
            'group-factory',
            'get-group',
            [groupId],
            alice.address
        );
        
        const group = groupInfo.result.expectSome().expectTuple();
        assertEquals(group['creator'], types.principal(alice.address));
        assertEquals(group['contribution-amount'], types.uint(1000000));
        assertEquals(group['max-members'], types.uint(5));
        assertEquals(group['current-members'], types.uint(0));
    },
});

Clarinet.test({
    name: "Test joining a group",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const alice = accounts.get('wallet_1')!;
        const bob = accounts.get('wallet_2')!;

        // Create group first
        let block = chain.mineBlock([
            Tx.contractCall('group-factory', 'create-group', [
                types.uint(1000000),
                types.uint(2)
            ], alice.address)
        ]);
        const groupId = block.receipts[0].result.expectOk();

        // Alice joins her own group
        block = chain.mineBlock([
            Tx.contractCall('group-factory', 'join-group', [
                groupId
            ], alice.address)
        ]);
        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result.expectOk(), true);

        // Bob joins the group
        block = chain.mineBlock([
            Tx.contractCall('group-factory', 'join-group', [
                groupId
            ], bob.address)
        ]);
        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result.expectOk(), true);

        // Verify both are members
        const aliceIsMember = chain.callReadOnlyFn(
            'group-factory',
            'is-member',
            [groupId, types.principal(alice.address)],
            alice.address
        );
        assertEquals(aliceIsMember.result, types.bool(true));

        const bobIsMember = chain.callReadOnlyFn(
            'group-factory',
            'is-member',
            [groupId, types.principal(bob.address)],
            alice.address
        );
        assertEquals(bobIsMember.result, types.bool(true));
    },
});

Clarinet.test({
    name: "Test group capacity limits",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const alice = accounts.get('wallet_1')!;
        const bob = accounts.get('wallet_2')!;
        const charlie = accounts.get('wallet_3')!;

        // Create group with max 2 members
        let block = chain.mineBlock([
            Tx.contractCall('group-factory', 'create-group', [
                types.uint(1000000),
                types.uint(2)
            ], alice.address)
        ]);
        const groupId = block.receipts[0].result.expectOk();

        // Fill the group
        block = chain.mineBlock([
            Tx.contractCall('group-factory', 'join-group', [groupId], alice.address),
            Tx.contractCall('group-factory', 'join-group', [groupId], bob.address)
        ]);
        assertEquals(block.receipts[0].result.expectOk(), true);
        assertEquals(block.receipts[1].result.expectOk(), true);

        // Charlie tries to join full group
        block = chain.mineBlock([
            Tx.contractCall('group-factory', 'join-group', [
                groupId
            ], charlie.address)
        ]);
        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectErr(types.uint(102)); // ERR-GROUP-FULL
    },
});

Clarinet.test({
    name: "Test duplicate join prevention",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const alice = accounts.get('wallet_1')!;

        // Create group
        let block = chain.mineBlock([
            Tx.contractCall('group-factory', 'create-group', [
                types.uint(1000000),
                types.uint(5)
            ], alice.address)
        ]);
        const groupId = block.receipts[0].result.expectOk();

        // Alice joins
        block = chain.mineBlock([
            Tx.contractCall('group-factory', 'join-group', [
                groupId
            ], alice.address)
        ]);
        assertEquals(block.receipts[0].result.expectOk(), true);

        // Alice tries to join again
        block = chain.mineBlock([
            Tx.contractCall('group-factory', 'join-group', [
                groupId
            ], alice.address)
        ]);
        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectErr(types.uint(103)); // ERR-ALREADY-MEMBER
    },
});