$(function(){
	
	//disable inputs 
	function enableDisableInputs(){
		if ($('.new-task').hasClass('active')) {
			//set opacity to main window(.list)
			$('.list').css('opacity', '0.7');
			$('#header-search').prop('disabled', true);
			$('#filter-status').prop('disabled', true);
			$('#filter-priotity').prop('disabled', true);
		}else{
			$('.list').css('opacity', '1');
			$('#header-search').prop('disabled', false);
			$('#filter-status').prop('disabled', false);
			$('#filter-priotity').prop('disabled', false);
		}
	}

	function hideErrorMsg(){
		if ($('.errorMessage').hasClass('active')){
			$('.errorMessage').removeClass('active');
		}
	}
	//open "add new task" pop-up
	$('.list-footer').on('click','#add_new', function(){
		if (!$('.new-task').hasClass('active')){
			$('.new-task').addClass('active');
			enableDisableInputs();
		}
	});

	function hideAddNew(){
		if ($('.new-task').hasClass('active')){
			$('.new-task').removeClass('active');
			enableDisableInputs();
			$('#title').val("");
			$('#priority').val("0");
		}
	}
	//cancel "add new task" pop-up
	$('.new-task-buttons').on('click', '#new-task-cancel', function(){
		hideAddNew();
	});

	//create new task
	$('.new-task-buttons').on('click', '#new-task-create', function(){
		let title = $('#title').val();
		let priority = $('#priority option:selected').val();
		if (title.length > 0 && priority != 0) {
			//get highest id
			let ids = $(".task").map(function() {
			    return parseInt($(this).data('id'));
			}).get();

			let highestId = Math.max.apply(Math, ids);
			let taskId = highestId+1;

			//check status filter
			let sort_status = $('#filter-status').val();
			let sort_status_class = '';
			console.log(sort_status);
			if (sort_status == 'done') {
				sort_status_class = 'hide-task';
			}
			console.log(sort_status_class);

			let taskMarkup = "<div class='task "+sort_status_class+"' data-id='"+taskId+"' data-status='to_do' data-priority='"+priority+"'>";
					taskMarkup+= "<div class='task-status'>";
						taskMarkup+= "<input type='checkbox' name='complete' id='tb"+taskId+"'><label for='tb"+taskId+"'></label>";
					taskMarkup+= "</div>";
					taskMarkup+= "<div class='task-content'>";
						taskMarkup+="<p class='task-content-title'>"+title+"</p>";
						taskMarkup+="<p class='task-content-priority'>"+priority+"/10</p>";
					taskMarkup+= "</div>";
					taskMarkup+= "<div class='task-delete'>";
						taskMarkup+="<img class='delete-img' src='delete.svg'>";
					taskMarkup+= "</div>";
				taskMarkup+="</div>";
			$('.list-content').append(taskMarkup);
			hideAddNew();
		}else{
			if (!$('.errorMessage').hasClass('active')){
				$('.errorMessage').addClass('active');
				setTimeout(hideErrorMsg, 2000);
			}
		}
	});

	//delete task
	$('.list-content').on('click','.delete-img',function(){
		let id = $(this).parent().parent().data('id');
		$('.task[data-id="'+id+'"]')[0].remove();
	});

	$('')


	function changeTaskStatus(taskId){
		let task = $('.task[data-id="'+taskId+'"]');
		if (!task.hasClass('task-done')) {
			task.addClass('task-done');
			task.data('status', 'done');
			task.attr('data-status', 'done');
		}else{
			task.removeClass('task-done');
			task.data('status', 'to_do');
			task.attr('data-status', 'to_do');
		}
	}
	//check task as complete
	$('.list-content').on('click', 'input[name=complete]', function(){
		let taskId = $(this).parent().parent().data('id');
		//find task with current id and set as done/to_do
		changeTaskStatus(taskId);
	});

	function sortByStatus(sort_status){
		if (sort_status == 'done' || sort_status == 'to_do') {
			$('.task').each(function(index){
				let status = $(this).data('status');
				if (status !== sort_status) {
					if (!$(this).hasClass('hide-task')) {
						$(this).addClass('hide-task');
					}
				}else{
					if ($(this).hasClass('hide-task')) {
						$(this).removeClass('hide-task');
					}
				}
			});
		}else{
			$('.task').each(function(){
				let status = $(this).data('status');
				if ($(this).hasClass('hide-task')) {
					$(this).removeClass('hide-task');
				}
			});
		}
	}

	//sort by status
	$('.header-filter-status').on('change', '#filter-status', function(){
		let sort_status = $(this).val();
		sortByStatus(sort_status);
	});

});