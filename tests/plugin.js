define(function (require) {
  var registerSuite = require('intern!object'),
      assert        = require('intern/chai!assert'),
      plugin        = require('intern/dojo/node!../index'),
      fs            = require('intern/dojo/node!fs'),
      gonzales      = require('intern/dojo/node!../node_modules/gonzales-pe');

  registerSuite({
    name: 'polish-no-calc-in-bg-position',

    message: function () {
      assert.strictEqual(plugin.message, 'Don\'t use calc() with background-position. It crashes IE9!');
    }
  });

  registerSuite({
    name: 'polish-no-calc-in-bg-position CSS tests',
    test: function() {
      var deferred = this.async(3000),
          errors;

      fs.readFile('./tests/css.css', deferred.callback(function(error, stylesheet) {
        if (error) {
          throw error;
        }

        errors = plugin.test(gonzales.parse(stylesheet.toString('utf8'), { syntax : 'css' }));

        assert.strictEqual(errors.length, 1);
        assert.equal(errors[0].node.first('selector').toString().trim(), '#this-rule-will-fail');
      }));
    }
  });

  registerSuite({
    name: 'polish-no-calc-in-bg-position SCSS tests',
    test: function() {
      var deferred = this.async(3000),
          errors;

      fs.readFile('./tests/scss.scss', deferred.callback(function(error, stylesheet) {
        if (error) {
          throw error;
        }

        errors = plugin.test(gonzales.parse(stylesheet.toString('utf8'), { syntax : 'scss' }));

        assert.strictEqual(errors.length, 2, 'It should return two errors.');
        assert.equal(errors[0].node.first('selector').toString().trim(), '#this-rule-will-fail');
        assert.equal(errors[1].node.first('selector').toString().trim(), '#this-fails-too', 'It should fail on the nested rule.');
      }));
    }
  });
});