
window.onload = function main(){
	var nav = document.getElementById('main-nav');
	var home_tab = nav.firstChild;
	setTimeout(10000);
	home_tab.className += " current_page_item";
}; 