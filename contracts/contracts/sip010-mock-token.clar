;; sip010-mock-token.clar
;; Mock SIP-010 token for testing stablecoin functionality

;; SIP-010 Standard Functions
(impl-trait .sip-010-trait.sip-010-trait)

;; Token definition
(define-fungible-token mock-token)

;; Token metadata
(define-constant TOKEN-NAME "Mock Test Token")
(define-constant TOKEN-SYMBOL "MOCK")
(define-constant TOKEN-DECIMALS u6)

;; Data variables
(define-data-var token-uri (optional (string-utf8 256)) none)
(define-data-var contract-owner principal tx-sender)

;; Error codes
(define-constant ERR-NOT-AUTHORIZED (err u500))
(define-constant ERR-INSUFFICIENT-BALANCE (err u501))
(define-constant ERR-INVALID-RECIPIENT (err u502))

;; SIP-010 Implementation
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    ;; TODO: Implement standard SIP-010 transfer
    (ok true)
  )
)

(define-read-only (get-name)
  (ok TOKEN-NAME)
)

(define-read-only (get-symbol)
  (ok TOKEN-SYMBOL)
)

(define-read-only (get-decimals)
  (ok TOKEN-DECIMALS)
)

(define-read-only (get-balance (account principal))
  (ok (ft-get-balance mock-token account))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply mock-token))
)

(define-read-only (get-token-uri)
  (ok (var-get token-uri))
)

;; Additional functions for testing
(define-public (mint (recipient principal) (amount uint))
  (begin
    ;; TODO: Implement minting for testing (owner only)
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (ft-mint? mock-token amount recipient)
  )
)

(define-public (burn (amount uint))
  (begin
    ;; TODO: Implement burning functionality
    (ft-burn? mock-token amount tx-sender)
  )
)