{
  description = "Mycelix EduNet - Privacy-Preserving Decentralized Education Platform";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, flake-utils, rust-overlay }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlays = [ (import rust-overlay) ];
        pkgs = import nixpkgs {
          inherit system overlays;
        };

        # Rust with WASM target included
        rustWithWasm = pkgs.rust-bin.stable.latest.default.override {
          targets = [ "wasm32-unknown-unknown" ];
        };
      in
      {
        devShells.default = pkgs.mkShell {
          name = "mycelix-edunet-dev";

          buildInputs = with pkgs; [
            # Rust with WASM support
            rustWithWasm

            # Build tools
            pkg-config
            openssl

            # Holochain tools (will be added later)
            # For now, just core Rust + WASM

            # Development utilities
            cargo-watch
            cargo-edit
          ];

          shellHook = ''
            echo ""
            echo "🎓 Mycelix EduNet Development Environment"
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo ""
            echo "  🦀  Rust $(rustc --version | cut -d' ' -f2)"
            echo "  🌐  WASM target: available"
            echo "  📦  Workspace members: 10"
            echo ""
            echo "  Quick commands:"
            echo "    cargo build --release                      # Build all"
            echo "    cargo build --target wasm32-unknown-unknown --release  # Build WASM"
            echo "    cargo test --all                           # Run tests"
            echo ""
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo "  Phase 2.1: WASM Build Verification ready"
            echo ""
          '';

          # Rust environment variables
          RUST_BACKTRACE = "1";
        };
      });
}
