class Defiswaplend < Formula
  desc "CLI for deploying DeFiSwapLend smart contract"
  homepage "https://github.com/Ngoxuansuu/DeFiSwapLend"
  url "https://registry.npmjs.org/defiswaplend/-/defiswaplend-1.0.0.tgz"
  sha256 "4CF61BC40494618B63D64548AAB4776D6836DFA3838A0A24AF7B2EAD1DE05766 "
  license "MIT"

  depends_on "node"

  def install
    system "npm", "install", *std_npm_args
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
    system "#{bin}/defiswaplend"
  end