import fs from 'fs'
import path from 'path'
import toml from 'toml'
import buildList from './buildlist'

const $x = Object.assign
const {
    basename,
    relative,
    extname,
    resolve,
    join
} = path

const config = toml.parse(fs.readFileSync(path.resolve('.rabbit')))

function defineIgnoreNames(...patten) {
    return `[^${patten.join('')}]`
}

function definePaths(...p) {
    return p.map(n => resolve(n))
}


class Environment {
    constructor(opts) {
	
	this.src = config.environment.src
	this.lib = config.environment.lib
	this.tmp = config.environment.tmp
	this.dll = config.environment.dll
	this.components = config.environment.components
	this.images = config.environment.images
	this.fonts = config.environment.fonts

	this.cssExtname = config.extname.css
	this.htmlExtname = config.extname.html
	this.jsExtname = config.extname.js

	this.ignorePrivateFile = config.ignores.private
	this.ignoreTmpFile = config.ignores.tmp
	this.ignoreBackupFile = config.ignores.backup
	
	this.init()
    }
    
    init() {
	
	const {
	    src, lib, components,
	    ignorePrivateFile,
	    ignoreTmpFile,
	    ignoreBackupFile
	} = this

	
	this.paths = definePaths(src, lib, components)
	this.ignoresForMajor = defineIgnoreNames(ignorePrivateFile, ignoreTmpFile, ignoreBackupFile)
	this.ignores = defineIgnoreNames(ignoreTmpFile, ignoreBackupFile)

	this.taskType = {
	    style: 'style',
	    page: 'page'
	}
	
	// @fixme
	//this.buildList = buildList(this.getMajorPath(this.cssExtname))
    }
    
    getMajorPath(extname) {
	const { src, ignoresForMajor } = this
	return `${src}/**/${ignoresForMajor}*.${extname}`
    }
    
    getMinorPath(extname) {
	const { src, lib, ignores } = this
	return [
	    `${lib}/**/${ignores}*.${extname}`,
	    `${src}/**/[_]*.${extname}`
	]
    }
}

export default function(opts) {
    return new Environment(opts)
}
