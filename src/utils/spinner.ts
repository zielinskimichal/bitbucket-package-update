import { Spinner } from 'cli-spinner';

export function createSpinner(text: string): Spinner {
  const spinner = new Spinner({
    text: `${text} %s`,
    stream: process.stdout,
    onTick: function (msg) {
      this.clearLine(this.stream);
      this.stream.write(msg);
    },
  });

  spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏');
  return spinner;
}
