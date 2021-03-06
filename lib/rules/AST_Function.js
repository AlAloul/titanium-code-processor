/**
 * <p>Copyright (c) 2009-2013 by Appcelerator, Inc. All Rights Reserved.
 * Please see the LICENSE file for information about licensing.</p>
 *
 * A function expression (function definitions are handled by {@link module:rules/defun}).
 *
 * @module rules/AST_Function
 * @see ECMA-262 Spec Chapter 13
 */

/**
 * @event module:rules/AST_Function.rule
 * @property {string} ruleName The string 'AST_Function'
 * @property {module:AST.node} ast The AST node that is an instance of this rule
 * @property {string} file The file that the rule begins on.
 * @property {number} line The line of the file where the rule begins on.
 * @property {number} column The column of the file where the rule begins on.
 * @property {boolean} processingComplete Indicates whether the rule has been processed yet or not. This can be used to
 *		determine if this is the pre-evalutation event or the post-evaluation event.
 * @property {module:base/types/function.FunctionType} result The created function object. Only available post-evaluation.
 */

var AST = require('../AST'),
	RuleProcessor = require('../RuleProcessor'),
	Base = require('../Base'),
	Runtime = require('../Runtime');

AST.registerRuleProcessor('AST_Function', function processRule() {

	RuleProcessor.preProcess(this);
	this._localVisualization = true;

	var identifier = this.name && this.name.name,
		formalParameterList = [],
		context = Base.getCurrentContext(),
		strict = context.strict || RuleProcessor.isBlockStrict(this),
		functionObject,
		funcEnv;

	RuleProcessor.fireRuleEvent(this, {}, false);
	RuleProcessor.logRule('AST_Function', identifier);

	if (identifier) {
		Base.setVisited(this.name);
	}

	for (i = 0, len = this.argnames.length; i < len; i++) {
		Base.setVisited(this.argnames[i]);
		formalParameterList.push(this.argnames[i].name);
	}

	try {
		if (strict) {
			if (identifier === 'eval' || identifier === 'arguments') {
				Base.handleRecoverableNativeException('SyntaxError', identifier + ' is not a valid identifier name');
				throw 'Unknown';
			}
			for (var i = 0, len = formalParameterList.length; i < len; i++) {
				if (formalParameterList[i] === 'eval' || formalParameterList[i] === 'arguments') {
					Base.handleRecoverableNativeException('SyntaxError', formalParameterList[i] + ' is not a valid identifier name');
					throw 'Unknown';
				}
				if (formalParameterList.indexOf(formalParameterList[i], i + 1) !== -1) {
					Base.handleRecoverableNativeException('SyntaxError', 'Duplicate parameter names are not allowed in strict mode');
					throw 'Unknown';
				}
			}
		}
		if (identifier) {
			funcEnv = new Base.newDeclarativeEnvironment(context.lexicalEnvironment);
			funcEnv.envRec.createImmutableBinding(identifier);
			functionObject = new Base.FunctionType(formalParameterList, this, funcEnv, strict);
			funcEnv.envRec.initializeImmutableBinding(identifier, functionObject);
		} else {
			functionObject = new Base.FunctionType(formalParameterList, this, context.lexicalEnvironment, strict);
		}
		functionObject._location = Runtime.getCurrentLocation();
	} catch(e) {
		if (e === 'Unknown') {
			functionObject = new Base.UnknownType();
		} else {
			throw e;
		}
	}

	RuleProcessor.fireRuleEvent(this, {
		result: functionObject
	}, true);

	RuleProcessor.postProcess(this, functionObject);

	return functionObject;
});