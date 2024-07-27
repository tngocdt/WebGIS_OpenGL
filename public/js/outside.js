$(document).ready(function(){  

    $('form').on('submit', function(){
  
        var item = $('form input');
        var inputData = {item: item.val()};

        alert("This is jQuery form submit!" + "\n"
                + "Data submitted: " + inputData);
        $.ajax({
          type: 'POST',
          url: '/todo',
          data: inputData,
          success: function(data){
            //do something with the data via front-end framework (client side)
            location.reload();
          }
        });
  
        return false;
  
    });
  
    $('li').on('click', function(){
        var item = $(this).text().replace(/ /g, "-");
        $.ajax({
          type: 'DELETE',
          url: '/todo/' + item,
          success: function(data){
            //do something with the data via front-end framework
            location.reload();
          }
        });
    });

    
  
  });

