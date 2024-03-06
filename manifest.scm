(use-modules (guix packages)
	     (gnu packages llvm))
(define better-clang
  (package
    (inherit clang-toolchain)
    (inputs (modify-inputs (package-inputs clang-toolchain)
			   (delete "ld-wrapper")))))
(concatenate-manifests
 (list
  (packages->manifest
   (list
    (list (@@ (gnu packages gcc) gcc-13) "lib")
    better-clang))
  (specifications->manifest
   (list
    "coreutils"
    "libgccjit"
    "make"
    "node"))))
