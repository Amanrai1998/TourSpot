$('#search-form').submit(function(){
  let inpVal = $('#search').val();
  $(this).attr('action', `/tourspots/search/${inpVal}`);
});