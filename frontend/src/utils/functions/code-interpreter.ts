const { PythonShell } = require('python-shell');

/**
 * Creates an instance of PythonShell that can be used as a REPL.
 */
class PythonREPL {
    private pythonShell: any;

    constructor() {
        this.pythonShell = new PythonShell('', { mode: 'text' });
    }

    /**
     * Sends code to the Python interpreter and returns the result.
     * @param code The code to execute.
     * @returns The result of executing the code.
     */
    execute(code: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            this.pythonShell.send(code);
            this.pythonShell.on('message', (message: string) => {
                resolve([message]);
            });
            this.pythonShell.end((err: Error) => {
                if (err) {
                    reject(err);
                }
            });
        });
    }
}

let pythonRepl: PythonREPL | null = null;

/**
 * Executes the given code in the specified language and returns the result.
 * @param code The code to execute.
 * @param language The language in which the code is written.
 * @returns The result of executing the code.
 */
export function repl(code: string, language: string) {
    if (language === 'python') {
        if (pythonRepl === null) {
            pythonRepl = new PythonREPL();
        }
        return pythonRepl.execute(code);
    } else {
        throw new Error(`Language ${language} not supported`);
    }
}

/**
 * Executes a command in the shell and returns the output.
 * @param command The command to execute.
 * @returns A Promise that resolves with the output of the command.
 */
export function command(command: string): Promise<string> {
    const { exec } = require('child_process');
    return new Promise<string>((resolve, reject) => {
        exec(command, (error: Error, stdout: string, stderr: string) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
}
