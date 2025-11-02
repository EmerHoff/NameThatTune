import * as readline from "readline";

/**
 * Utility for reading user input from command line
 */
export class ReadlineUtil {
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  /**
   * Prompts user for input
   * @param question - Question to ask the user
   * @returns Promise<string> - User's input
   */
  question(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, (answer: string) => {
        resolve(answer.trim());
      });
    });
  }

  /**
   * Closes the readline interface
   */
  close(): void {
    this.rl.close();
  }
}
