#!/usr/bin/env ts-node

const { Odyssey } = require("../src");
let odyssey = new Odyssey();

let logo: string = `
              __                               
  ____   ____/ /__  __ _____ _____ ___   __  __
 / __ \\ / __  // / / // ___// ___// _ \\ / / / /
/ /_/ // /_/ // /_/ /(__  )(__  )/  __// /_/ / 
\\____/ \\__,_/ \\__, //____//____/ \\___/ \\__, /  
             /____/                   /____/   
`

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log(logo)
  console.log("Interactive Odyssey!");
  const repl = require('repl');
  repl.start({
    prompt: "odyssey> ",
    eval: (input: string, _ctx: any, _filename: any, cb: any) => {
      const out = odyssey.interpret(input);
      let [ derive, tree, value ] = out;
      if (out) { cb(null, value) };
    }
  })
} else {
  const fs = require('fs');
  const contents = fs.readFileSync(args[0]).toString();
  const result = odyssey.interpret(contents);
}
