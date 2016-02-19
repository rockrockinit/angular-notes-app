/**
 * Export Controller
 *
 * @author Ed Rodriguez <ed@edrodriguez.com>
 * @created 2016-02-15
 */
pages.controller('ExportCtrl', [
  '$scope',
  '$location',
  '$mdDialog',
  '$log',
  'AppService',
  '$sce',
  'fb',
  function($scope, $location, $mdDialog, $log, $app, $sce, fb){
    $log.info('ExportCtrl');
    
    $app.setTitle('Export');
    
    var notes = JSON.parse(JSON.stringify($app.notes));
    
    for(var i=0; i<notes.length; i++){
      var str = notes[i].note;
      str = str.replace(/<br>/gi, '[br]');
      
      var $frag = $('<div></div>').html(str);
      notes[i].note = $frag.text().replace(/\[br\]/gi, '\n');
      
      if(notes[i].created){
        notes[i].created = moment(notes[i].created).format('M/D/YY h:mma');
      }
      
      if(notes[i].updated){
        notes[i].updated = moment(notes[i].updated).format('M/D/YY h:mma');
      }
    }
    
    notes = JSON.stringify(notes);
    notes = notes.replace(/\",\"/gi, '",\n"');
    notes = notes.replace(/(\d),\"/gi, '$1,\n"');
    notes = notes.replace(/\},\{/gi, '},\n{');
    notes = notes.replace(/\{\"/gi, '{\n"');
    notes = notes.replace(/\"\}/gi, '"\n}');
    notes = notes.replace(/^\"/mgi, '\t"');
    notes = notes.replace(/\":(\"|\d)/gi, '": $1');
    notes = notes.replace(/\s*\"\$\$hashKey\":\s*\"object\:\d+\"\n/gi, '\n');
    notes = notes.replace(/\s*\"id\"\: \d+,\n/gi, '\n');
    
    notes = $sce.trustAsHtml(notes);
    $scope.notes = notes;
  }
]);
