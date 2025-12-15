;; oracle-registry.clar
;; Registry for managing oracle attestations and settlement triggers

;; Data structures
(define-map authorized-oracles principal bool)
(define-map attestations {group-id: uint, oracle: principal} {
	investment-results: (list 50 {member: principal, final-amount: uint}),
	timestamp: uint,
	verified: bool
})

;; Data variables
(define-data-var contract-owner principal tx-sender)
(define-data-var min-attestations uint u1)

;; Error codes
(define-constant ERR-NOT-AUTHORIZED (err u300))
(define-constant ERR-ORACLE-NOT-REGISTERED (err u301))
(define-constant ERR-ATTESTATION-EXISTS (err u302))
(define-constant ERR-INSUFFICIENT-ATTESTATIONS (err u303))

;; Public functions
(define-public (register-oracle (oracle principal))
	(begin
		;; Only the contract owner can register oracles, so input is trusted.
		;; Clarity does not provide a built-in way to distinguish contract vs. standard principal.
		(asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
		(ok (map-set authorized-oracles oracle true))
	)
)

(define-public (publish-attestation 
	(group-id uint) 
	(investment-results (list 50 {member: principal, final-amount: uint})))
	(begin
		;; TODO: Implement attestation publishing logic
		;; Only callable by authorized oracles
		(ok true)
	)
)

(define-public (trigger-settlement (group-id uint))
	(begin
		;; TODO: Implement settlement trigger when enough attestations received
		;; Calls escrow-stx.settle-group
		(ok true)
	)
)

;; Read-only functions
(define-read-only (is-authorized-oracle (oracle principal))
	(default-to false (map-get? authorized-oracles oracle))
)

(define-read-only (get-attestation (group-id uint) (oracle principal))
	(map-get? attestations {group-id: group-id, oracle: oracle})
)
