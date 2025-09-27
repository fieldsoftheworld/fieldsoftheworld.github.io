# Fields of The World (FTW) 🌾 Website

[![Website](https://img.shields.io/badge/website-fieldsofthe.world-green)](https://fieldsofthe.world)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
[![Jekyll](https://img.shields.io/badge/Jekyll-CC0000?style=flat&logo=Jekyll&logoColor=white)](https://jekyllrb.com/)


## About

This repository drives the website for Fields of The World.

🌐 **Live Website**: [fieldsofthe.world](https://fieldsofthe.world)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **macOS**: Homebrew package manager
- **Ruby**: Version 3.0+ (we'll install via Homebrew)
- **Git**: For version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/fieldsoftheworld/fieldsoftheworld.github.io.git
   cd fieldsoftheworld.github.io
   ```

2. **Install Ruby via Homebrew** (if not already installed)
   ```bash
   brew install --formula ruby
   ```

3. **Set up Ruby PATH**
   ```bash
   export PATH="/opt/homebrew/opt/ruby/bin:$PATH"
   export PATH="/opt/homebrew/lib/ruby/gems/3.4.0/bin:$PATH"
   ```

   Add these lines to your shell profile (`~/.zshrc` or `~/.bash_profile`) to make them permanent:
   ```bash
   echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
   echo 'export PATH="/opt/homebrew/lib/ruby/gems/3.4.0/bin:$PATH"' >> ~/.zshrc
   ```

4. **Install Jekyll and Bundler**
   ```bash
   gem install jekyll bundler
   ```

## Local Development

To run the website locally for development:

1. **Start the Jekyll server**
   ```bash
   jekyll serve --host 0.0.0.0 --port 4000
   ```

2. **Open your browser** and navigate to:
   ```
   http://localhost:4000
   ```

The site will automatically regenerate when you make changes to the files. Press `Ctrl+C` to stop the server.

### Troubleshooting

**Jekyll command not found?**
- Ensure Ruby gems bin directory is in your PATH
- Try running with full path: `/opt/homebrew/lib/ruby/gems/3.4.0/bin/jekyll serve`

**Permission issues?**
- Make sure you have write permissions to the project directory
- Try running with `--safe` flag: `jekyll serve --safe`

## Project Structure

```
fieldsoftheworld.github.io/
├── _layouts/           # Jekyll layout templates
│   └── default.html    # Main site layout
├── static/             # Static assets
│   ├── css/           # Stylesheets
│   ├── images/        # Images and logos
│   └── js/            # JavaScript files
├── map/               # Interactive map components
├── map-src/           # Map source files
├── index.html         # Homepage
├── tutorial.html      # Dataset tutorial
├── paper.html         # Research paper page
├── contributing.html  # Contribution guidelines
├── LICENSE            # CC BY-SA 4.0 license
└── README.md          # This file
```

## Contributing

We welcome contributions to improve the website and documentation! Please see our [Contributing Guidelines](contributing.html) for details on:

- How to report bugs
- How to suggest enhancements
- Code style guidelines
- Pull request process

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test locally using Jekyll serve
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Dataset Access

<!-- TODO: Add specific instructions for downloading the FTW dataset -->
For information about accessing the Fields of The World dataset, please visit the [Get Started](https://fieldsofthe.world/#get-started) section of our website.

## Citation

If you use the Fields of The World dataset in your research, please cite:

```bibtex
<!-- TODO: Add proper citation once paper is published -->
@misc{ftw2024,
  title={Fields of The World: A Comprehensive Benchmark Dataset for Agricultural Field Boundaries},
  author={[Authors to be added]},
  year={2024},
  url={https://fieldsofthe.world}
}
```

## License

This website is licensed under the [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/).

[![CC BY-SA 4.0](https://licensebuttons.net/l/by-sa/4.0/88x31.png)](https://creativecommons.org/licenses/by-sa/4.0/)

You are free to:
- **Share** — copy and redistribute the material in any medium or format
- **Adapt** — remix, transform, and build upon the material

Under the following terms:
- **Attribution** — You must give appropriate credit
- **ShareAlike** — If you remix, transform, or build upon the material, you must distribute your contributions under the same license

## Contact

- **Website**: [fieldsofthe.world](https://fieldsofthe.world)
- **Issues**: [GitHub Issues](https://github.com/fieldsoftheworld/fieldsoftheworld.github.io/issues)
- **Email**: [Contact information to be added]

## Acknowledgments

- Contributors to the open datasets that were harmonized into FTW
- The Sentinel-2 satellite imagery program
- Jekyll and GitHub Pages for hosting infrastructure
- All contributors to this project

---

**Note**: This is the website repository for Fields of The World. For the actual dataset files and research code, please visit [the main project page](https://fieldsofthe.world).