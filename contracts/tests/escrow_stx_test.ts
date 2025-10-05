import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Test STX deposit contribution",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const alice = accounts.get('wallet_1')!;
        const groupId = types.uint(1);
        const amount = types.uint(1000000); // 1 STX

        let block = chain.mineBlock([
            Tx.contractCall('escrow-stx', 'deposit-contribution', [
                groupId,
                amount
            ], alice.address)
        ]);

        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result.expectOk(), true);

        // Verify balance was recorded
        const balance = chain.callReadOnlyFn(
            'escrow-stx',
            'get-escrow-balance',
            [groupId, types.principal(alice.address)],
            alice.address
        );
        assertEquals(balance.result, amount);
    },
});

Clarinet.test({
    name: "Test group settlement distribution",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const alice = accounts.get('wallet_1')!;
        const bob = accounts.get('wallet_2')!;
        const groupId = types.uint(1);

        // Simulate equal profit/loss distribution
        const finalAmounts = types.list([
            types.tuple({
                'member': types.principal(alice.address),
                'amount': types.uint(1000000) // Equal share
            }),
            types.tuple({
                'member': types.principal(bob.address),
                'amount': types.uint(1000000) // Equal share
            })
        ]);

        let block = chain.mineBlock([
            Tx.contractCall('escrow-stx', 'settle-group', [
                groupId,
                finalAmounts
            ], alice.address) // TODO: Should be restricted to oracle-registry
        ]);

        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result.expectOk(), true);
    },
});

Clarinet.test({
    name: "Test settlement withdrawal",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const alice = accounts.get('wallet_1')!;
        const groupId = types.uint(1);

        // First need to have a settled amount (this would normally be set by settle-group)
        let block = chain.mineBlock([
            Tx.contractCall('escrow-stx', 'withdraw-settlement', [
                groupId
            ], alice.address)
        ]);

        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result.expectOk(), true);
    },
});

Clarinet.test({
    name: "Test group total tracking",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const alice = accounts.get('wallet_1')!;
        const bob = accounts.get('wallet_2')!;
        const groupId = types.uint(1);

        // Deposit contributions
        let block = chain.mineBlock([
            Tx.contractCall('escrow-stx', 'deposit-contribution', [
                groupId,
                types.uint(1000000)
            ], alice.address),
            Tx.contractCall('escrow-stx', 'deposit-contribution', [
                groupId,
                types.uint(1000000)
            ], bob.address)
        ]);

        assertEquals(block.receipts.length, 2);
        assertEquals(block.receipts[0].result.expectOk(), true);
        assertEquals(block.receipts[1].result.expectOk(), true);

        // Check total
        const total = chain.callReadOnlyFn(
            'escrow-stx',
            'get-group-total',
            [groupId],
            alice.address
        );
        assertEquals(total.result, types.uint(2000000)); // 2 STX total
    },
});