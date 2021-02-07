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

	function changeTaskStatus(taskId){
		let task = $('.task[data-id="'+taskId+'"]');
		if (!task.hasClass('task-done')) {
			task.addClass('task-done');
			task.attr('data-status', 'done');
		}else{
			task.removeClass('task-done');
			task.attr('data-status', 'to_do');
		}
	}

	function hideErrorMsg(){
		if ($('.errorMessage').hasClass('active')){
			$('.errorMessage').removeClass('active');
		}
	}
	//open "add new task" pop-up
	$('#add_new').on('click', function(){
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
	$('#new-task-cancel').on('click', function(){
		hideAddNew();
	});

	//create new task
	$('#new-task-create').on('click', function(){
		let title = $('#title').val();
		let priority = $('#priority option:selected').val();
		if (title.length > 0 && priority != 0) {
			//get highest id
			let ids = $(".task").map(function() {
			    return parseInt($(this).data('id'));
			}).get();

			let highestId = Math.max.apply(Math, ids);
			let taskId = highestId+1;

			let taskMarkup = "<div class='task' data-id='"+taskId+"' data-status='to_do' data-priority='"+priority+"'>";
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

	//check task as complete
	$('.task-status').on('click', 'input[name=complete]', function(){
		let taskId = $(this).parent().parent().data('id');
		//find task with current id and set as complete
		changeTaskStatus(taskId);
	});

	
});