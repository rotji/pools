import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Test oracle registration",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const oracle = accounts.get('wallet_1')!;

        // Register oracle
        let block = chain.mineBlock([
            Tx.contractCall('oracle-registry', 'register-oracle', [
                types.principal(oracle.address)
            ], deployer.address)
        ]);

        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result.expectOk(), true);

        // Verify oracle is registered
        const isAuthorized = chain.callReadOnlyFn(
            'oracle-registry',
            'is-authorized-oracle',
            [types.principal(oracle.address)],
            deployer.address
        );
        assertEquals(isAuthorized.result, types.bool(true));
    },
});

Clarinet.test({
    name: "Test unauthorized oracle registration",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const alice = accounts.get('wallet_1')!;
        const oracle = accounts.get('wallet_2')!;

        // Non-owner tries to register oracle
        let block = chain.mineBlock([
            Tx.contractCall('oracle-registry', 'register-oracle', [
                types.principal(oracle.address)
            ], alice.address) // Alice is not the contract owner
        ]);

        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectErr(types.uint(300)); // ERR-NOT-AUTHORIZED
    },
});

Clarinet.test({
    name: "Test attestation publishing",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const oracle = accounts.get('wallet_1')!;
        const alice = accounts.get('wallet_2')!;
        const bob = accounts.get('wallet_3')!;

        // Register oracle first
        let block = chain.mineBlock([
            Tx.contractCall('oracle-registry', 'register-oracle', [
                types.principal(oracle.address)
            ], deployer.address)
        ]);
        assertEquals(block.receipts[0].result.expectOk(), true);

        // Publish attestation
        const groupId = types.uint(1);
        const investmentResults = types.list([
            types.tuple({
                'member': types.principal(alice.address),
                'final-amount': types.uint(1200000)
            }),
            types.tuple({
                'member': types.principal(bob.address),
                'final-amount': types.uint(800000)
            })
        ]);

        block = chain.mineBlock([
            Tx.contractCall('oracle-registry', 'publish-attestation', [
                groupId,
                investmentResults
            ], oracle.address)
        ]);

        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result.expectOk(), true);

        // Verify attestation was stored
        const attestation = chain.callReadOnlyFn(
            'oracle-registry',
            'get-attestation',
            [groupId, types.principal(oracle.address)],
            oracle.address
        );
        assertEquals(attestation.result.isSome(), true);
    },
});

Clarinet.test({
    name: "Test unauthorized attestation publishing",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const unauthorizedOracle = accounts.get('wallet_1')!;
        const alice = accounts.get('wallet_2')!;

        // Try to publish attestation without being registered
        let block = chain.mineBlock([
            Tx.contractCall('oracle-registry', 'publish-attestation', [
                types.uint(1),
                types.list([
                    types.tuple({
                        'member': types.principal(alice.address),
                        'final-amount': types.uint(1000000)
                    })
                ])
            ], unauthorizedOracle.address)
        ]);

        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectErr(types.uint(301)); // ERR-ORACLE-NOT-REGISTERED
    },
});

Clarinet.test({
    name: "Test settlement triggering",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const oracle = accounts.get('wallet_1')!;

        // Register oracle
        let block = chain.mineBlock([
            Tx.contractCall('oracle-registry', 'register-oracle', [
                types.principal(oracle.address)
            ], deployer.address)
        ]);
        assertEquals(block.receipts[0].result.expectOk(), true);

        // Publish attestation first
        const groupId = types.uint(1);
        block = chain.mineBlock([
            Tx.contractCall('oracle-registry', 'publish-attestation', [
                groupId,
                types.list([])
            ], oracle.address)
        ]);
        assertEquals(block.receipts[0].result.expectOk(), true);

        // Trigger settlement
        block = chain.mineBlock([
            Tx.contractCall('oracle-registry', 'trigger-settlement', [
                groupId
            ], oracle.address)
        ]);

        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result.expectOk(), true);
    },
});