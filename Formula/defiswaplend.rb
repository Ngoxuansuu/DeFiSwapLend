class Defiswaplend < Formula
  desc "CLI for deploying DeFiSwapLend smart contract"
  homepage "https://github.com/Ngoxuansuu/DeFiSwapLend"
  url "https://registry.npmjs.org/defiswaplend/-/defiswaplend-1.0.0.tgz"
  sha256 "162BB1791B86C52ABB3944A571EA2C22DF16E1ACEEE7856CF751C87A98FB53E3"
  license "MIT"

  depends_on "node"

  def install
    system "npm", "install", *std_npm_args
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
    system "#{bin}/defiswaplend"
  end