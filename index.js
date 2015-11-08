module.exports = {
  message: 'Don\'t use calc() with background-position. It crashes IE9!',
  name: 'no-calc-in-bg-position',
  test: function(ast){
    var errors = [];

    ast.traverseByType('ruleset', function(rule){
      rule.forEach('block', function (block){
        block.forEach('declaration', function (declaration){
          declaration.forEach('property', function (property){
            var ident = property.contains('ident') && property.first('ident');

            if (ident.content !== 'background-position' || rule.toString().indexOf('calc(') === -1) {
              return;
            }

            errors.push({
              node: rule
            });
          });
        });
      });
    });

    return errors;
  }
};
