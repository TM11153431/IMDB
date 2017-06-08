function search() {
	input = document.getElementById("searchbox").value
	alert(input)

	$.ajax({
	  type: "POST",
	  url: "~/scraper.py",
	  data: { param: input}
	}).done(function( o ) {
	   console.log('test')
	});
}