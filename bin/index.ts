#!/usr/bin/env ts-node
const { Odyssey } = require("../src/index");
let odyssey = new Odyssey();

let logo: string = `
              __                               
  ____   ____/ /__  __ _____ _____ ___   __  __
 / __ \\ / __  // / / // ___// ___// _ \\ / / / /
/ /_/ // /_/ // /_/ /(__  )(__  )/  __// /_/ / 
\\____/ \\__,_/ \\__, //____//____/ \\___/ \\__, /  
             /____/                   /____/   
`
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
