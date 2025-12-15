;; SIP-010 Fungible Token Trait Definition
;; https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-trait.clar

(define-trait sip-010-trait
  (
    ;; Standard SIP-010 functions
    (get-name () (response (string-utf8 32) uint))
    (get-symbol () (response (string-utf8 32) uint))
    (get-decimals () (response uint uint))
    (get-balance-of (principal) (response uint uint))
    (get-total-supply () (response uint uint))
    (transfer (uint principal principal) (response bool uint))
    (approve (uint principal) (response bool uint))
    (allowance (principal principal) (response uint uint))
  )
)
