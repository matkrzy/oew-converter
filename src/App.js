import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    output: '',
    link: '',
    fileName: '',
    input: '',
    autoDownload: true,
  };

  inputArea = null;
  button = null;

  constructor() {
    super();
  }

  componentDidMount() {
    this.inputArea.addEventListener('drop', this.handleFileSelect, false);
  }

  componentWillUnmount() {
    this.inputArea.addEventListener('dragover', this.handleDragOver, false);
  }

  handleFileSelect = e => {
    e.stopPropagation();
    e.preventDefault();

    const file = e.dataTransfer.files[0]; // FileList object.

    const reader = new FileReader();

    reader.onload = (file => {
      return e => {
        const input = e.target.result;
        const fileName = file.name;
        this.setState(
          {
            input,
            fileName,
          },
          () => {
            this.convert(this.state.input);
            if (this.state.autoDownload) {
              this.button.click();
            }
          },
        );
      };
    })(file);

    reader.readAsBinaryString(file);
  };

  handleDragOver = e => {
    e.stopPropagation();
    e.preventDefault();

    e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  };

  onTextAreaChange = e => {
    const input = e.target.value;
    !!input && this.convert(input);
  };

  convert = input => {
    const valueAsArray = input.split('\n');
    const start = 2;
    const end = valueAsArray.length;
    const valueAsArraySplited = [...valueAsArray].splice(start, end - 1);

    const removedSpacesOnStart = valueAsArraySplited.map(line =>
      line
        .replace(/\s*/, '')
        .replace(/\s*$/, '')
        .replace(/  +/g, ';'),
    );

    const output = removedSpacesOnStart.join('\n');
    this.setState({ output, input }, this.handleSave);
  };

  handleSave = () => {
    const file = new Blob([this.state.output], { type: 'text/plain' });
    this.setState({ link: URL.createObjectURL(file) });
  };

  render() {
    return (
      <div className="App">
        <label>
          <input
            type="checkbox"
            checked={this.state.autoDownload}
            onChange={e => this.setState({ autoDownload: e.target.checked })}
          />
          auto-download
        </label>
        <div>
          <textarea
            placeholder="Here copy file to convert"
            onChange={this.onTextAreaChange}
            ref={inputArea => (this.inputArea = inputArea)}
            value={this.state.input}
          />

          <textarea
            placeholder="Output will appears here"
            value={this.state.output}
          />

          {!!this.state.fileName.length && (
            <div>
              <a
                href={this.state.link}
                download={`${this.state.fileName}.txt`}
                ref={button => (this.button = button)}
              >
                download file {this.state.fileName}.txt
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
