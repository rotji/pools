;; group-factory.clar
;; Main contract for creating and managing investment groups

;; Data structures
(define-map groups uint {
  creator: principal,
  contribution-amount: uint,
  max-members: uint,
  current-members: uint,
  status: (string-ascii 20),
  created-at: uint
})

(define-map group-members {group-id: uint, member: principal} {
  contribution-paid: bool,
  join-timestamp: uint
})

;; Data variables
(define-data-var next-group-id uint u1)

;; Error codes
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-GROUP-NOT-FOUND (err u101))
(define-constant ERR-GROUP-FULL (err u102))
(define-constant ERR-ALREADY-MEMBER (err u103))
(define-constant ERR-INVALID-AMOUNT (err u104))

;; Public functions
(define-public (create-group (contribution-amount uint) (max-members uint))
  (begin
    ;; TODO: Implement group creation logic
    (ok (var-get next-group-id))
  )
)

(define-public (join-group (group-id uint))
  (begin
    ;; TODO: Implement join group logic with STX escrow
    (ok true)
  )
)

;; Read-only functions
(define-read-only (get-group (group-id uint))
  (map-get? groups group-id)
)

(define-read-only (is-member (group-id uint) (member principal))
  (is-some (map-get? group-members {group-id: group-id, member: member}))
)