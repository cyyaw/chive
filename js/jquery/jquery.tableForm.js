(function($) {	
	
	$.fn.appendForm = function(url, data, className)
	{
		
		if(!className)
		{
			className = 'form';
		}
		
		return this.each(function() {
			
			if(this.tagName == "TABLE")
			{
				return $(this).find("tbody tr:last").appendForm(url);
			}
			else if(this.tagName != "TR")
			{
				return $(this);
			}
		
			var obj = $(this);
			var id = className + '_' + url.replace(/[^\w]/g, "_");		
			var tableObj = obj.parents("table:first");
			
			if($('#' + id).length > 0)
			{
				return;
			}
			
			
			/*
			 * Create element
			 */
			
			var tableColumns = 0;
			obj.children("td").each(function() {
				tableColumns += this.colSpan;
			});
			
			var tr = document.createElement('tr');
			var td = document.createElement('td');
			var div = document.createElement('div');
			var trObj = $(tr);
			var tdObj = $(td);
			var divObj = $(div);
			
			trObj.addClass('noCheckboxes');
			trObj.addClass(className);
			trObj.attr("id", id);
			
			tdObj.attr("colspan", tableColumns);
			
			divObj.addClass(className);
			divObj.html('<span class="icon"><img src="' + baseUrl + '/images/loading.gif" alt="' + lang.get('core', 'loading') + '" class="icon icon16" /> <span>' + lang.get('core', 'loading') + '...</span></span>');
			
			divObj.appendTo(tdObj);
			tdObj.appendTo(trObj);
			trObj.insertAfter(obj);
			
			
			/*
			 * Fetch contents
			 */
			
			var setAjaxForms = function() {
				var forms = divObj.children('form');
				forms.submit(function(event) {
					$(this).parent().block({css: null, overlayCss: null, message: null});
				});
				forms.ajaxForm({
					success: function(responseText, statusText) {
						try 
						{
							JSON.parse(responseText);
							AjaxResponse.handle(responseText, statusText);
						}
						catch(ex) 
						{
							divObj.html(responseText);
							setAjaxForms();	
						}
					}
				});
			};
			
			divObj.load(url, data, function() {
				divObj.slideDown(500);
				setAjaxForms();
				divObj.find('input:first').select();
			});
			
			var targetOffset = obj.position().top + $('#content').scrollTop();
			$('#content').animate({scrollTop: targetOffset}, 500);
			
			
			/*
			 * Return self
			 */
			
			return $(this);
		
		});
		
	}

})(jQuery);
