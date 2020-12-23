import escodegen from 'escodegen'
import * as esprima from 'esprima'
import demo from './demo'

function process() {
	let parsed = esprima.parseScript(demo)
	let coded = escodegen.generate(parsed)
	console.log('parsed', parsed)
	// console.log('coded', coded)
}

export default process