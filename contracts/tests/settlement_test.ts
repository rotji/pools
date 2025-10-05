import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Test settlement calculation with equal distribution",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const alice = accounts.get('wallet_1')!;
        const bob = accounts.get('wallet_2')!;
        const groupId = types.uint(1);

        // Alice invested 1 STX and got 1.2 STX back
        // Bob invested 1 STX and got 0.8 STX back
        // Total invested: 2 STX, Total returned: 2 STX (break even)
        // Equal distribution: 1 STX each
        const memberResults = types.list([
            types.tuple({
                'member': types.principal(alice.address),
                'invested': types.uint(1000000),
                'returned': types.uint(1200000)
            }),
            types.tuple({
                'member': types.principal(bob.address),
                'invested': types.uint(1000000),
                'returned': types.uint(800000)
            })
        ]);

        let block = chain.mineBlock([
            Tx.contractCall('settlement', 'calculate-settlement', [
                groupId,
                memberResults
            ], alice.address)
        ]);

        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result.expectOk(), true);

        // Verify settlement was calculated
        const settlement = chain.callReadOnlyFn(
            'settlement',
            'get-settlement',
            [groupId],
            alice.address
        );
        assertEquals(settlement.result.isSome(), true);
    },
});

Clarinet.test({
    name: "Test settlement with profit scenario",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const alice = accounts.get('wallet_1')!;
        const bob = accounts.get('wallet_2')!;
        const groupId = types.uint(1);

        // Both made profit: Total invested 2 STX, total returned 3 STX
        // Equal distribution: 1.5 STX each
        const memberResults = types.list([
            types.tuple({
                'member': types.principal(alice.address),
                'invested': types.uint(1000000),
                'returned': types.uint(2000000) // Alice got 2 STX back
            }),
            types.tuple({
                'member': types.principal(bob.address),
                'invested': types.uint(1000000),
                'returned': types.uint(1000000) // Bob broke even
            })
        ]);

        let block = chain.mineBlock([
            Tx.contractCall('settlement', 'calculate-settlement', [
                groupId,
                memberResults
            ], alice.address)
        ]);

        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result.expectOk(), true);
    },
});

Clarinet.test({
    name: "Test settlement finalization",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const alice = accounts.get('wallet_1')!;
        const groupId = types.uint(1);

        let block = chain.mineBlock([
            Tx.contractCall('settlement', 'finalize-settlement', [
                groupId
            ], alice.address)
        ]);

        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result.expectOk(), true);
    },
});

Clarinet.test({
    name: "Test individual settlement claiming",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const alice = accounts.get('wallet_1')!;
        const groupId = types.uint(1);

        let block = chain.mineBlock([
            Tx.contractCall('settlement', 'claim-settlement', [
                groupId
            ], alice.address)
        ]);

        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result.expectOk(), true);
    },
});

Clarinet.test({
    name: "Test member settlement lookup",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const alice = accounts.get('wallet_1')!;
        const groupId = types.uint(1);

        // Should return none if no settlement exists yet
        const memberSettlement = chain.callReadOnlyFn(
            'settlement',
            'get-member-settlement',
            [groupId, types.principal(alice.address)],
            alice.address
        );
        assertEquals(memberSettlement.result.isNone(), true);
    },
});