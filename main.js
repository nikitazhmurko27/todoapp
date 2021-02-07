$(function(){
	
	//Header Date
	let date = new Date();
	let dayArr = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
	let monthArr = ['January', 'Ferbruary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	let dayOfWeek = dayArr[parseInt(date.getDay())];
	let month = monthArr[parseInt(date.getMonth())];
	let day = date.getDate();

	$('#header-date-day').text(dayOfWeek + ", ");
	$('#header-date-month').text(month + " " + day);

	function recaluclateTasks(){
		let sortStatus = $('#filter-status').val();
		let count = 0;
		let criteria = $('#header-search').val();
		
		if (sortStatus != 'all') {
			if (criteria.length > 0) {
				$('.task').each(function(){
					let status = $(this).data('status');
					let classes = $(this).attr('class');
					if (status == sortStatus && classes.indexOf('hide-task') <= 0) {
						count++
					}
				});
			}else{
				count = parseInt($('.task[data-status="'+sortStatus+'"]').length);
			}
		}else{
			if (criteria.length > 0) {
				$('.task').each(function(){
					let classes = $(this).attr('class');
					if (classes.indexOf('hide-task') <= 0) {
						count++
					}
				});
			}else{
				count = parseInt($('.task').length);
			}
		}
		if (count == 1) {
			$('#tasks_count').text(count + " task");
		}else{
			$('#tasks_count').text(count + " tasks");
		}
	}

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
			let sortStatus = $('#filter-status').val();
			let sortStatusClass = '';
			if (sortStatus == 'done') {
				sortStatusClass = 'hide-task';
			}

			let taskMarkup = "<div class='task "+sortStatusClass+"' data-id='"+taskId+"' data-status='to_do' data-priority='"+priority+"'>";
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

			//check status priority
			let prioritySort = $('#filter-priotity').val();
			if (prioritySort !== 'none') {
				sortPriority(prioritySort);
			}
			hideAddNew();
			recaluclateTasks();
			$('#header-search').val("");
			search('');
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
		recaluclateTasks();
		$('#header-search').val("");
		search('');
	});

	//check task as complete
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
	
	$('.list-content').on('click', 'input[name=complete]', function(){
		let taskId = $(this).parent().parent().data('id');
		//find task with current id and set as done/to_do
		changeTaskStatus(taskId);
	});

	//sort by status
	function sortByStatus(sortStatus){
		if (sortStatus == 'done' || sortStatus == 'to_do') {
			$('.task').each(function(index){
				let status = $(this).data('status');
				if (status !== sortStatus) {
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
				if ($(this).hasClass('hide-task')) {
					$(this).removeClass('hide-task');
				}
			});
		}
	}

	$('.header-filter-status').on('change', '#filter-status', function(){
		let sortStatus = $(this).val();
		sortByStatus(sortStatus);
		recaluclateTasks();
		$('#header-search').val("");
		search('');
	});

	//sort by priority 
	function sortPriority(sort){
		let result = $('.task').sort(function(a, b){
			let contentA =parseInt( $(a).data('priority'));
      		let contentB =parseInt( $(b).data('priority'));
      		if (sort == 'asc') {
      			return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
      		}else if(sort == 'des'){
      			return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
      		}else{
      			let contentA =parseInt( $(a).data('id'));
      			let contentB =parseInt( $(b).data('id'));
      			return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0; 
      		}
		});
		$('.list-content').empty();
		$('.list-content').append(result);
		return result;
	}

	$('.header-filter-priority').on('change', '#filter-priotity', function(){
		let sortStatus = $(this).val();
		sortPriority(sortStatus);
		recaluclateTasks();
		$('#header-search').val("");
	});

	//search
	$('#header-search').keyup(function () {
		let criteria = $(this).val();
		search(criteria);
	});
	function search(criteria){
		if (criteria.length > 0) {
			criteria = criteria.toLowerCase();
			$('.task-content-title').each(function(){
				let title = $(this).text().toLowerCase();
				let id = $(this).parent().parent().data('id');
				let task = $('.task[data-id="'+id+'"]');
				if (title.indexOf(criteria) < 0) {
					if (!task.hasClass('hide-task')) {
						task.addClass('hide-task');
					}
				}else{
					if ($(this).hasClass('hide-task')) {
						$(this).removeClass('hide-task');
					}
				}
			});
		}else{
			$('.task').each(function(){
				if ($(this).hasClass('hide-task')) {
					$(this).removeClass('hide-task');
				}
			});
			//check status filter
			let sortStatus = $('#filter-status').val();
			sortByStatus(sortStatus);
		}
		recaluclateTasks();
	}
});