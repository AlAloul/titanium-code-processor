var path = require("path"),
	Types = require(path.join(require.main.exports.libPath, "Types")),
	assert = require("assert");

function test(value) {
	try {
		assert.ok(value);
		return true;
	} catch(e) {
		return false;
	}
}

module.exports = [{
		name: "Data",
		test: function(runNextTest) {
			runNextTest(test(!Types.isAccessorDescriptor(new Types.TypeDataProperty())));
		}
	},{
		name: "Accessor",
		test: function(runNextTest) {
			runNextTest(test(Types.isAccessorDescriptor(new Types.TypeAccessorProperty())));
		}
	},{
		name: "Generic",
		test: function(runNextTest) {
			runNextTest(test(!Types.isAccessorDescriptor({
				enumerable: false,
				configurable: false
			})));
		}
	},{
		name: "Undefined",
		test: function(runNextTest) {
			runNextTest(test(!Types.isAccessorDescriptor()));
		}
	}
];