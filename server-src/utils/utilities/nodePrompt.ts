import * as readLineSync from 'readline-sync';

export function nodePrompt(prompt: string): string
{
    const output = readLineSync.question(prompt);
    return output;
}
