{
  description = "Rust development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils}:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
        
        # Rust development dependencies
        java-dependencies = with pkgs; [    
          jdk21
          gradle
        ];
        
        node-dependencies = with pkgs; [
          nodejs_20
          nodePackages.npm
          nodePackages.yarn
          nodePackages.pnpm

          python3
          gcc
          pkg-config
          openssl
          unzip
        ];

        dependencies = [
          java-dependencies
          node-dependencies
        ];
      in
      {
        # Development shells
        devShells.default = pkgs.mkShell {
          buildInputs = dependencies;
          
          # For native dependencies
          nativeBuildInputs = with pkgs; [ pkg-config ];
          
          shellHook = ''
            echo "☕Java development environment ready!"
            java -version
            echo "Gradle version:"
            gradle --version
            echo "Maven version:"
            maven --version

            echo "🚀 React development environment ready!"
            echo "Node.js version: $(node --version)"
            echo "npm version: $(npm --version)"
            
            # Configuración opcional para npm/yarn
            export NODE_ENV=development
            
            # Si usas pnpm, descomenta la línea siguiente:
            # export PNPM_HOME="$HOME/.local/share/pnpm"
            # export PATH="$PNPM_HOME:$PATH"
          '';
        };
      }
    );
}