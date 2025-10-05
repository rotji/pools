import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Test SIP-010 token metadata",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const alice = accounts.get('wallet_1')!;

        // Test token name
        const name = chain.callReadOnlyFn(
            'sip010-mock-token',
            'get-name',
            [],
            alice.address
        );
        assertEquals(name.result.expectOk(), types.ascii("Mock Test Token"));

        // Test token symbol
        const symbol = chain.callReadOnlyFn(
            'sip010-mock-token',
            'get-symbol',
            [],
            alice.address
        );
        assertEquals(symbol.result.expectOk(), types.ascii("MOCK"));

        // Test decimals
        const decimals = chain.callReadOnlyFn(
            'sip010-mock-token',
            'get-decimals',
            [],
            alice.address
        );
        assertEquals(decimals.result.expectOk(), types.uint(6));
    },
});

Clarinet.test({
    name: "Test token minting",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const alice = accounts.get('wallet_1')!;
        const amount = types.uint(1000000); // 1 token with 6 decimals

        // Mint tokens to Alice
        let block = chain.mineBlock([
            Tx.contractCall('sip010-mock-token', 'mint', [
                types.principal(alice.address),
                amount
            ], deployer.address)
        ]);

        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result.expectOk(), true);

        // Check Alice's balance
        const balance = chain.callReadOnlyFn(
            'sip010-mock-token',
            'get-balance',
            [types.principal(alice.address)],
            alice.address
        );
        assertEquals(balance.result.expectOk(), amount);

        // Check total supply
        const totalSupply = chain.callReadOnlyFn(
            'sip010-mock-token',
            'get-total-supply',
            [],
            alice.address
        );
        assertEquals(totalSupply.result.expectOk(), amount);
    },
});

Clarinet.test({
    name: "Test unauthorized minting",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const alice = accounts.get('wallet_1')!;
        const bob = accounts.get('wallet_2')!;

        // Alice (not owner) tries to mint
        let block = chain.mineBlock([
            Tx.contractCall('sip010-mock-token', 'mint', [
                types.principal(bob.address),
                types.uint(1000000)
            ], alice.address)
        ]);

        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectErr(types.uint(500)); // ERR-NOT-AUTHORIZED
    },
});

Clarinet.test({
    name: "Test token transfer",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const alice = accounts.get('wallet_1')!;
        const bob = accounts.get('wallet_2')!;
        const amount = types.uint(1000000);
        const transferAmount = types.uint(500000);

        // First mint tokens to Alice
        let block = chain.mineBlock([
            Tx.contractCall('sip010-mock-token', 'mint', [
                types.principal(alice.address),
                amount
            ], deployer.address)
        ]);
        assertEquals(block.receipts[0].result.expectOk(), true);

        // Alice transfers to Bob
        block = chain.mineBlock([
            Tx.contractCall('sip010-mock-token', 'transfer', [
                transferAmount,
                types.principal(alice.address),
                types.principal(bob.address),
                types.none()
            ], alice.address)
        ]);

        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result.expectOk(), true);

        // Check balances
        const aliceBalance = chain.callReadOnlyFn(
            'sip010-mock-token',
            'get-balance',
            [types.principal(alice.address)],
            alice.address
        );
        assertEquals(aliceBalance.result.expectOk(), types.uint(500000));

        const bobBalance = chain.callReadOnlyFn(
            'sip010-mock-token',
            'get-balance',
            [types.principal(bob.address)],
            alice.address
        );
        assertEquals(bobBalance.result.expectOk(), transferAmount);
    },
});

Clarinet.test({
    name: "Test token burning",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const alice = accounts.get('wallet_1')!;
        const amount = types.uint(1000000);
        const burnAmount = types.uint(300000);

        // First mint tokens to Alice
        let block = chain.mineBlock([
            Tx.contractCall('sip010-mock-token', 'mint', [
                types.principal(alice.address),
                amount
            ], deployer.address)
        ]);
        assertEquals(block.receipts[0].result.expectOk(), true);

        // Alice burns some tokens
        block = chain.mineBlock([
            Tx.contractCall('sip010-mock-token', 'burn', [
                burnAmount
            ], alice.address)
        ]);

        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result.expectOk(), true);

        // Check updated balance
        const balance = chain.callReadOnlyFn(
            'sip010-mock-token',
            'get-balance',
            [types.principal(alice.address)],
            alice.address
        );
        assertEquals(balance.result.expectOk(), types.uint(700000));

        // Check updated total supply
        const totalSupply = chain.callReadOnlyFn(
            'sip010-mock-token',
            'get-total-supply',
            [],
            alice.address
        );
        assertEquals(totalSupply.result.expectOk(), types.uint(700000));
    },
});