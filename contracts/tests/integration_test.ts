import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Integration test: create-group → join-group → publish-attestation → settle flow",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const alice = accounts.get('wallet_1')!;
        const bob = accounts.get('wallet_2')!;
        const oracle = accounts.get('wallet_3')!;

        // Step 1: Register oracle
        let block = chain.mineBlock([
            Tx.contractCall('oracle-registry', 'register-oracle', [
                types.principal(oracle.address)
            ], deployer.address)
        ]);
        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result.expectOk(), true);

        // Step 2: Create a group
        block = chain.mineBlock([
            Tx.contractCall('group-factory', 'create-group', [
                types.uint(1000000), // 1 STX contribution
                types.uint(2)        // max 2 members
            ], alice.address)
        ]);
        assertEquals(block.receipts.length, 1);
        const groupId = block.receipts[0].result.expectOk();

        // Step 3: Alice and Bob join the group
        block = chain.mineBlock([
            Tx.contractCall('group-factory', 'join-group', [
                groupId
            ], alice.address),
            Tx.contractCall('group-factory', 'join-group', [
                groupId
            ], bob.address)
        ]);
        assertEquals(block.receipts.length, 2);
        assertEquals(block.receipts[0].result.expectOk(), true);
        assertEquals(block.receipts[1].result.expectOk(), true);

        // Step 4: Oracle publishes attestation with investment results
        block = chain.mineBlock([
            Tx.contractCall('oracle-registry', 'publish-attestation', [
                groupId,
                types.list([
                    types.tuple({
                        'member': types.principal(alice.address),
                        'final-amount': types.uint(1200000) // Alice made profit
                    }),
                    types.tuple({
                        'member': types.principal(bob.address),
                        'final-amount': types.uint(800000)  // Bob made loss
                    })
                ])
            ], oracle.address)
        ]);
        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result.expectOk(), true);

        // Step 5: Trigger settlement (should distribute equally)
        block = chain.mineBlock([
            Tx.contractCall('oracle-registry', 'trigger-settlement', [
                groupId
            ], oracle.address)
        ]);
        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result.expectOk(), true);

        // Step 6: Members withdraw their equal share
        // Total invested: 2,000,000 microSTX (2 STX)
        // Total returned: 2,000,000 microSTX (Alice: 1.2 STX + Bob: 0.8 STX = 2 STX)
        // Equal distribution: 1,000,000 microSTX each (1 STX each)
        block = chain.mineBlock([
            Tx.contractCall('escrow-stx', 'withdraw-settlement', [
                groupId
            ], alice.address),
            Tx.contractCall('escrow-stx', 'withdraw-settlement', [
                groupId
            ], bob.address)
        ]);
        assertEquals(block.receipts.length, 2);
        assertEquals(block.receipts[0].result.expectOk(), true);
        assertEquals(block.receipts[1].result.expectOk(), true);
    },
});

Clarinet.test({
    name: "Test group creation with invalid parameters",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const alice = accounts.get('wallet_1')!;

        // Try to create group with 0 contribution
        let block = chain.mineBlock([
            Tx.contractCall('group-factory', 'create-group', [
                types.uint(0),  // Invalid: 0 contribution
                types.uint(2)
            ], alice.address)
        ]);
        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectErr(types.uint(104)); // ERR-INVALID-AMOUNT
    },
});

Clarinet.test({
    name: "Test unauthorized oracle attestation",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const alice = accounts.get('wallet_1')!;
        const unauthorizedOracle = accounts.get('wallet_2')!;

        // Create a group first
        let block = chain.mineBlock([
            Tx.contractCall('group-factory', 'create-group', [
                types.uint(1000000),
                types.uint(2)
            ], alice.address)
        ]);
        const groupId = block.receipts[0].result.expectOk();

        // Try to publish attestation with unauthorized oracle
        block = chain.mineBlock([
            Tx.contractCall('oracle-registry', 'publish-attestation', [
                groupId,
                types.list([])
            ], unauthorizedOracle.address)
        ]);
        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectErr(types.uint(301)); // ERR-ORACLE-NOT-REGISTERED
    },
});