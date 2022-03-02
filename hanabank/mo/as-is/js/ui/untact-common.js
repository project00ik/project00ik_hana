//하단 버튼 노출 
var countCheck = 0;
var bottomBtn = {
	init : function() {
		var checkLen = $('.j_check_all').length,
			checkOkLen = 0;
		$('.j_check_all').each(function(e) {
			var _this = $(this);
			if (_this.hasClass('check_on')) {
				checkOkLen++;
			}
		});
		if (checkLen == checkOkLen) {
			if($('.j_btn_fix').parents('.contents').hasClass('j_oneDown') && countCheck === 0 ){
				countCheck ++
				$('.j_btn_fix').fadeIn(200,'easeInOutCirc');
				setTimeout(function(){
					var windowSize = $(window).height();
					var bodySize = $('body').outerHeight();
					$('html,body').stop().animate({scrollTop : bodySize-windowSize}, 600, 'easeInOutCubic')
				},400)
			}
			$('.j_btn_fix').fadeIn(200,'easeInOutCirc');
		}

		// 다음버튼 FadeOut 제거 20200908
		// else {
		// 	$('.j_btn_fix').fadeOut(200,'easeInOutCirc');
		// }
	}
}


//오토포커스 이동
var focusMove = {
	init : function (target) {
		var _this = target;
		if(_this.val().length > 0 || _this.text().length > 0){
			_this.removeClass('j_input_value');
		}

		if (_this.next('.j_input_value').length > 0) {
			_this.next('.j_input_value').trigger('focus');
		}else if (_this.parents('.input_form').nextAll('.j_focus').eq(0).length > 0) {
			_this.blur();
			if (_this.parents('.input_form').nextAll('.j_focus').eq(0).find('.j_focus_open').length > 0) {
				_this.parents('.input_form').nextAll('.j_focus').eq(0).show().find('.j_focus_open').trigger('click');
				if(_this.val().length > 0 || _this.text().length > 0){
					_this.parents('.input_form').find('.j_focus_open').removeClass('j_focus_open');
				}
			}else {
				_this.parents('.input_form').nextAll('.j_focus').eq(0).show().find('.j_input_value').trigger('focus');
				if(_this.val().length > 0 || _this.text().length > 0){
					_this.parents('.input_form').find('.j_focus_open').removeClass('j_input_value');
				}
			}
			if(_this.val().length > 0 || _this.text().length > 0){
				_this.parents('.input_form').removeClass('j_focus');
			}
			
		}else if (_this.parents('.input_form_group').nextAll('.j_focus_group').eq(0).length > 0) {
			_this.blur();
			_this.parents('.input_form').removeClass('j_focus');
			_this.parents('.input_form_group').nextAll('.j_focus_group').eq(0).show();

			$('.wrapper').on('scroll click touchstart touchmove',function(e) {e.preventDefault();});
			setTimeout(function() {
				$('body').css('min-height',$('html').height() +  (_this.parents('.input_form_group').nextAll('.j_focus_group').eq(0).offset().top - 51));
				$('html,body').stop().animate({scrollTop : _this.parents('.input_form_group').nextAll('.j_focus_group').eq(0).offset().top - (51+35)},500); // 35 는 상단 간격
				setTimeout(function() {
					$('.wrapper').off('scroll click touchstart touchmove');
					// 20200715 s
					if(_this.parents('.input_form_group').nextAll('.j_focus_group').eq(0).find('.j_holdOn').length > 0){
						_this.blur();
						return false;
					}
					// 20200715 e
					if (_this.parents('.input_form_group').nextAll('.j_focus_group').eq(0).find('.j_focus').eq(0).find('.j_focus_open').length > 0) {
						_this.parents('.input_form_group').nextAll('.j_focus_group').eq(0).find('.j_focus').eq(0).find('.j_focus_open').trigger('click');
						if(_this.val().length > 0 || _this.text().length > 0){
							_this.parents('.input_form_group').removeClass('j_focus_group')
						}
					}else {
						_this.parents('.j_focus').nextAll('.j_focus_group').eq(0).find('.j_focus').eq(0).find('.j_input_value').trigger('focus');
					}
				},500);
			},200);
		}else {
			_this.blur();
			$('body').stop().animate({'min-height' :''},500); // 20.04.21 수정
			if(_this.val().length > 0 || _this.text().length > 0){
				_this.parents('.input_form').removeClass('j_focus').find('.j_focus_open').removeClass('j_input_value')
				_this.parents('.input_form_group').removeClass('j_focus_group')
				
				// 마지막 form_Group FadeIn 실행 20200908
				$('.j_btn_fix').fadeIn(200,'easeInOutCirc');
			}
		}
	}
}

//인풋 텍스트 
var inputTxt = {
	init : function(target) {
		var _this = target;
		if ($(_this).prop('readonly')) {
			return false;
		}
		if (_this.val().length > 0 || _this.text().length > 0) {
			if (_this.hasClass('j_check_all')) {
				_this.addClass('check_on');
				_this.removeClass('j_input_value')
				_this.parents('.input_form').removeClass('j_focus').find('.input_title').removeClass('j_focus_open')
				// _this.parents('.input_form_group').addClass('j_focus_group')
			}
			if (_this.hasClass('j_email')) {
				layerEmail.init($(_this));
			}
			_this.siblings('.j_data_del').show();
		}else {
			_this.removeClass('check_on');
			_this.siblings('.j_data_del').hide();
			_this.addClass('j_input_value');
			_this.parents('.input_form').addClass('j_focus').find('.input_title').addClass('j_focus_open');
			_this.parents('.input_form_group').addClass('j_focus_group');
		}
	}
}

//스크롤
var scrollArrOrg=[],
	scrollArr=[],
	layerScroll=[];
var scrollCont = {
	init : function(target) {
		if ($(target).find('.j_scroll').length > 0) {
			$(target).find('.j_scroll').addClass('on');
			scrollArrOrg.push(target);
			$.each(scrollArrOrg, function(i, el){
				if($.inArray(el, scrollArr) === -1) scrollArr.push(el);
			});
			
			for (var i = $(target).find('.j_scroll.on').length - 1; i >= 0; i--) {
				// 20200717
				layer_90_Height(target)
				// 20200717 e
				var results;
				layerScroll[scrollArr.indexOf(target)] = new Swiper($(target).find('.j_scroll.on')[i], {
					direction: 'vertical',
					slidesPerView: 'auto',
					freeMode: true,
					freeModeMomentumBounce: false,
					mousewheelControl: true,
					mousewheel: true,
					on: {
						reachEnd: function(){
							// console.log(target)
						},
						touchStart: function(e){
							if($(e.target).parents('.agreement_frame').hasClass('j_frame_swiper')){
								layerScroll[scrollArr.indexOf(target)].allowTouchMove = false
							}else{
								layerScroll[scrollArr.indexOf(target)].allowTouchMove = true
							}
						}
					},
				});
			}
			// 팝업 리사이즈 안드로이드 이슈
			var firstSize = window.outerHeight;  //로드 되었을대 높이
			$(window).resize(function() {
				if(this.resizeTo){
					clearTimeout(this.resizeTo);
				}
				this.resizeTo = setTimeout(function(){
					$(this).trigger('resizeEnd')
				},300)
			})
			//20200715
			$(window).on('resizeEnd',function(){
				var changeingSize = window.outerHeight; 
				var really_offTop = changeingSize - $(target).find('.layer_contents').height();

				if ($(target).find('.layer_90').length > 0) {
					if(firstSize > window.outerHeight){ //줄어들때
						if($(target).find('.pop_fix_area').length > 0) {
							popH = $(target).find('.pop_tit').height() +  $(target).find('.pop_fix_area').height();
							$(target).find('.j_scroll').height(changeingSize - (popH + really_offTop));
							layerScroll[scrollArr.indexOf(target)].update();
						}else if($(target).find('.pop_fix_area').length === 0){
							popH = $(target).find('.pop_tit').height();
							$(target).find('.j_scroll').height(changeingSize - (popH + really_offTop));
							layerScroll[scrollArr.indexOf(target)].update();
						}
					}else if(firstSize <= window.outerHeight) { // 길어질때
						if($(target).find('.pop_fix_area').length > 0) {
							popH = $(target).find('.pop_tit').height() +  $(target).find('.pop_fix_area').height();
							$(target).find('.j_scroll').height(changeingSize - (popH + really_offTop));
							layerScroll[scrollArr.indexOf(target)].update();
						}else if($(target).find('.pop_fix_area').length === 0){
							popH = $(target).find('.pop_tit').height();
							$(target).find('.j_scroll').height(changeingSize - (popH + really_offTop));
							layerScroll[scrollArr.indexOf(target)].update();
						}
					}
				}
			})
		}
	}
}

// let currentHeight;
var beforeHeight;
//레이어 열기
var layerOpen = {
	init : function(layerId, layerIndex) {
		$(layerId).fadeIn(400, 'easeInOutSine', function(){
			if(scrollArr.indexOf(layerId) === -1){
				scrollCont.init(layerId);
			}else if(scrollArr.indexOf(layerId) > -1){
				if($(layerId).find('.j_scroll').find('.swiper-notification').length > 0){
					// 20200717 
					layer_90_Height(layerId)
					// 20200717 e
					layerScroll[scrollArr.indexOf(layerId)].update();
				}else if($(layerId).find('.j_scroll').find('.swiper-notification').length === 0){
					scrollCont.init(layerId);
				}
			}
		});

		setTimeout(function() {
			$('html,body').css('overflow','hidden');
			$('.contents,.layerpopup,.pop_tit').on('touchmove',function(e) {e.preventDefault();});
			$(layerId).addClass('on')
			
			if (layerIndex != undefined) {
				$(layerId).find('.j_select_slide_cont').css({'left' : -$(this).width()*layerIndex});
			}
		},110);
		setTimeout(function() {
			beforeHeight = window.scrollY
		},600)
	},
	movePoint : function(layerId, point){
		$(layerId).fadeIn(400, 'easeInOutSine', function(){
			if(scrollArr.indexOf(layerId) === -1){
				scrollCont.init(layerId);
			}else if(scrollArr.indexOf(layerId) > -1){
				if($(layerId).find('.j_scroll').find('.swiper-notification').length > 0){
					// 20200717
					layer_90_Height(layerId)
					// 20200717e
					layerScroll[scrollArr.indexOf(layerId)].update();
				}else if($(layerId).find('.j_scroll').find('.swiper-notification').length === 0){
					scrollCont.init(layerId);
				}
			}
		});
		
		setTimeout(function() {
			$('html,body').css('overflow','hidden');
			$('.contents,.layerpopup,.pop_tit').on('touchmove',function(e) {e.preventDefault();});
			$(layerId).addClass('on')
		},110);
		var _thisElement = document.querySelector(layerId);
		var _movingElement = _thisElement.querySelector('.swiper-wrapper');
		_movingElement.style.transform = "translate3d(0px, "+(-point.offsetTop)+'px'+", 0px)";
	}
}
//레이어 닫기
var layerClose = {
	init : function (target,subTarget) {
		var _this = $(target).parents('.layerpopup');
		if (subTarget == 'all') {
			setTimeout(function() {
				$('.layerpopup.on').fadeOut();
				_this.fadeOut();
				$('.layerpopup.on').removeClass('on');
				$('.j_scroll').removeClass('on');
			},100);
			$('html,body').css('overflow','');
			$('.contents,.layerpopup,.pop_tit').off('touchmove');
		}else {
			setTimeout(function() {
				_this.fadeOut(400, 'easeInOutSine');
				_this.removeClass('on');
				_this.find('.j_scroll').removeClass('on');
			},100);
			if($('.layerpopup.on').length == 1) {
				$('html,body').css('overflow','');
				$('.contents,.layerpopup,.pop_tit').off('touchmove');
			}
		}
		bottomBtn.init();
	}
}

//이메일 20200701 수정
var emailCount = 0;
var layerEmail = {
	init : function(target) {
		var target_text = $(target).val()
		var result = Array.from(target_text).filter(function(word){
			return word === '@'
		})
		if(result.length > 0 && $(target).siblings('.j_email_layer').find('.swiper-slide').children().length > 0){
			if($(target).siblings('.j_email_layer').css('display') === 'none'){
				$(target).siblings('.j_email_layer').slideDown(200,'easeInOutCirc');
			}
			if(emailCount < 1 ){
				scrollCont.init($(target).siblings('.j_email_layer'));
				emailCount++;
			}
			setTimeout(function(){
				for(var i = 0; i < layerScroll.length; i++){
					layerScroll[i].update()
				}
			},200)
			
		}else if($(target).siblings('.j_email_layer').find('.swiper-slide').children().length === 0){//result.length === 0
			$(target).siblings('.j_email_layer').slideUp(200,'easeInOutCirc');

		}
	}
}

//동의서 0803 수정
var checkType = {
	checking : function(thisTarget){
		var thisInput = thisTarget.attr('class')
		var checkingLength = $("input[type='checkbox']:checked"+'.'+thisInput).length
		var checkedLength = $('.'+thisInput).length
		var isparents = thisTarget.parents('#'+thisInput).find("input[type='checkbox']");
		if(checkedLength === checkingLength){
			isparents.first().prop('checked',true)
		}else if(checkingLength !== checkedLength){
			isparents.first().prop('checked',false)
		}
		checkType.parentCheck(thisTarget)
	},
	// 상품서비스 안내수단
	checktype01 : function(thisTarget){
		var thisInput = thisTarget.attr('class')
		var checkingLength = $("input[type='checkbox']:checked"+'.'+thisInput).length
		var isparents = thisTarget.parents('#'+thisInput).find("input[type='checkbox']");
		if( checkingLength > 0 ){
			isparents.first().prop('checked',true)
			if(isparents.attr('check-target')){
				var siblingsinpt = isparents.attr('check-target');
				var prevInpt = thisTarget.parents('#'+thisInput).prev().find("input[type='checkbox']");
				$(prevInpt).prop('checked',true);
				$(siblingsinpt).prop('checked',true).prop('disabled',false);
				checkType.parentCheck(thisTarget);
			}
		}else if(checkingLength === 0){
			isparents.first().prop('checked',false)
			if(isparents.attr('check-target')){
				var siblingsinpt = isparents.attr('check-target')
				var prevInpt = thisTarget.parents('#'+thisInput).prev().find("input[type='checkbox']");
				$(prevInpt).prop('checked',false);
				if($(thisTarget).parents('.depth02_area').find("input[check-target]:checked").length === 0){
					$(siblingsinpt).prop('checked',false).prop('disabled',true)
				}
				checkType.parentCheck(thisTarget)
			}
		}
	},
	parentCheck : function(thisTarget){
		var thisInput = thisTarget.attr('class')
		var isparents = thisTarget.parents('#'+thisInput).find("input[type='checkbox']");
		if(isparents.length > 0){
			checkType.checking(isparents.first())	
		}
	}
}
//신청중인 상품 건 수
var applying_listCheck = {
	listCheck : function(lists){
		var list_ea = lists.length
		$('.pages_tit').find('.number').text(list_ea)
	}
}

// 상품 체크리스트 20200708
var checkPopup = {
	confirm : function(agrees, layer){
		$(layer).off('click').on('click' ,function(e){
			if(e.target.parentElement.classList.contains('last_ck')){
				if(e.target.classList.contains('confirm') && !$(agrees).parent().hasClass('on')){
					layerClose.init($(this));
					$(agrees).parent().addClass('on')
					var agreeQuantity = $('.check_list li.on').length
					var itemTit = $('.swiper-pagination li').eq($(agrees).parents('.tabcont').index()).text();
					var itemName = $(agrees).children('strong').text();
					$('.checking_list').append("<li><span>"+itemTit+"</span><strong>"+itemName+"</strong></li>")    
					if(agreeQuantity > 0){
						$('.btn_fix').fadeIn(200,'easeInOutCirc');
					}
					$('.list_sum').text(agreeQuantity)
			   }
			}
		})
	},
	cancel : function(agrees, layer){
		$(layer).off('click').on('click', function(e){
			e.preventDefault();
		   if(e.target.classList.contains('confirm')){
				$(this).hide()
				$(agrees).parent().removeClass('on')
				var agreeQuantity = $('.check_list li.on').length
				var itemName = $(agrees).children('strong').text()
				$('.checking_list li strong').each(function(){
					$(this).filter(function(){
						if($(this).text() === itemName){
							$(this).parent().remove();
						}
					})
				})
				if(agreeQuantity <= 0){
					$('.btn_fix').fadeOut(200,'easeInOutCirc');
				}
				$('.list_sum').text(agreeQuantity)
		   }else if(e.target.className === 'cancel'){
				$(this).hide()
		   }
		})
	},
	remove : function(deleteTarget, layer){
		$(layer).click(function(e){
			if(e.target.className === 'confirm'){
				$(this).fadeOut(200,'easeInOutCirc');
				var targetLeyar = $(e.target).attr('layer-target')
				$(targetLeyar).fadeIn(200,'easeInOutCirc');
				$(targetLeyar).click(function(e){
					if(e.target.className === 'confirm'){
						$(this).fadeOut(200,'easeInOutCirc');
						$(deleteTarget).remove();
						applying_listCheck.listCheck($('.applying_list>li'))
					}
				})
			}
		})
	}
}

// 보안매체 선택리스트, 출금계좌 추가 리스트
var selectOfElement = {
	selected : function(target, parent){
		var fromTarget = target.classList.contains("j_get_data"); //false
		var targetName = parent.getAttribute('element-target');
		var toElement = document.querySelector(targetName);
		var getDataTarget = target.hash;

		if(!fromTarget) {
			$(toElement).slideUp(200,'easeInOutCirc');
			$(getDataTarget).removeClass('j_input_value')
			$(getDataTarget).parents('.input_form').removeClass('j_focus').find('.j_focus_open').removeClass('j_focus_open')
		}
		else{
			$(getDataTarget).removeClass('j_input_value')
			$(getDataTarget).parents('.input_form').removeClass('j_focus').find('.j_focus_open').removeClass('j_focus_open')
		}
	}
}

var popupModule = (function(){
	function popTopPosition(obj){
		var wHeight = $(window).height();
		var dHeight = document.body.clientHeight;
		var wWidth = $(window).width();
		var contHeight = obj.outerHeight();

		if(obj.hasClass('square_pop') || obj.hasClass('full_bttm_pop')){
			obj.find('.pop_body').css({
				'max-height': wHeight - 56
			});
			if(obj.hasClass('full_height')){
				obj.find('.pop_body').css({
					'height': wHeight - 56
				});
			}
		}
		if($('.box_bubble01').length > 0){
			$('.box_bubble01 .box_bubble_cont').css('max-height', wHeight - 164);
		}

		if(wHeight <= contHeight){
			if(obj.hasClass('full_pop')){
				obj.css({
					'top': '0'
				});
			}
		} else if(wHeight <= contHeight + 56){
			if(obj.hasClass('square_pop')){
				obj.css({
					'top': '39px',
					'transform': 'translateY(0)'
				});
			}
		} else {
			if(obj.hasClass('square_pop')) {
				obj.css({
					'top': '50%',
					'transform': 'translateY(-50%)'
				});
			} else if(obj.hasClass('full_bttm_pop')) { // 하단에 붙는 팝업
				obj.css({
					'top': ''
				});
			} else {
				obj.css({
					'top': (wHeight/2) - (contHeight/2)
				});
			}
		}
	} // popTopPosition end

	return {
		popOpen : function (popup){
			var posY = $(window).scrollTop();

			$('.'+ popup).fadeIn(300);
			setTimeout(function(){
				popTopPosition($('.'+ popup +' .pop_wrap'));
			}, 0);

			$('.'+ popup).addClass('open').find('.dim').show();
			if($('.pop_fixed_wrap:visible').length > 1){
			} else {
				$('body').addClass('body_fixed').css('top', -posY);	
			}
			

			var objPopWrap = $('.'+ popup +' .pop_wrap');

			if(objPopWrap.hasClass('pop_body_scr')){
				var ogHeight = objPopWrap.outerHeight();
				if(ogHeight > $(window).height()){
					var popBodyH = $(window).height() - 63; //objPopWrap.find('.pop_body').offset().top;
					objPopWrap.find('.pop_body').css({'overflow':'auto', 'height': popBodyH});
				}
			}

			$(window).resize(function(){
				setTimeout(function(){
					var windowHeight = $(window).height();
					if(objPopWrap.hasClass('pop_body_scr')){
						if(ogHeight > windowHeight){
							var popBodyH = $(window).height() - 63; //objPopWrap.find('.pop_body').offset().top;
							objPopWrap.find('.pop_body').css({'overflow':'auto', 'height': popBodyH});
						} else {
							objPopWrap.find('.pop_body').css({'height': 'auto'});
						}
					}
					popTopPosition(objPopWrap);
				}, 0);
			});
		}, // popOpen end
		popClose : function(e){
			if($('.pop_fixed_wrap:visible').length > 1){
			} else {
				var posTop = Math.abs(parseInt($('body').css('top')));
				$('body').removeClass('body_fixed').css('top', 0);
				$(window).scrollTop(posTop);
			}
			e.parents('.pop_fixed_wrap').removeClass('open').fadeOut(200);
		}, // popClose end
		scaleYes : function(){
			$('meta[name=viewport]').attr('content', 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=2.0, user-scalable=yes, viewport-fit=cover');
		},
		scaleNo : function(){
			$('meta[name=viewport]').attr('content', 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
		},
		toastOpen : function(el, delay){
			el.show();
			setTimeout(function(){
				el.addClass('open');
			}, 10);
			setTimeout(function(){
				el.removeClass('open');
				setTimeout(function(){
					el.hide();
				}, 500);
			}, delay);
		}
	}
})();

$(document).ready(function(){
	// form 이벤트 막기
	var submitAction = function(e) {
		e.preventDefault();
		e.stopPropagation();
		/* do something with Error */
	};
	$('form').bind('submit', submitAction);
	
	// finance_list
	if($('.wrapper').find('.finance_list').hasClass('finance_list') === true){
		$('.finance_list li a').each(function(){
			var financeName = $(this).text();
			var financeList = $(this);
			switch(financeName){
				case '하나은행': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol00@2x.png)'})
				break
				case '국민은행': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol01@2x.png)'})
				break
				case '농협은행': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol02@2x.png)'})
				break
				case '우리은행': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol03@2x.png)'})
				break
				case '우체국': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol04@2x.png)'})
				break
				case '신한은행': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol05@2x.png)'})
				break
				case '기업은행': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol06@2x.png)'})
				break
				case '경남은행': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol07@2x.png)'})
				break
				case '광주은행': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol08@2x.png)'})
				break
				case '대구은행': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol09@2x.png)'})
				break
				case '부산은행': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol07@2x.png)'})
				break
				case '산업은행': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol10@2x.png)'})
				break
				case '상호저축은행중앙회': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol11@2x.png)'})
				break
				case '새마을금고중앙회': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol12@2x.png)'})
				break
				case '신협중앙회': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol13@2x.png)'})
				break
				case '산림조합중앙회': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol14@2x.png)'})
				break
				case '수협중앙회': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol15@2x.png)'})
				break
				case '전북은행': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol08@2x.png)'})
				break
				case '제주은행': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol05@2x.png)'})
				break
				case '한국씨티은행': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol16@2x.png)'})
				break
				case 'SC은행': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol17@2x.png)'})
				break
				case '케이뱅크': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol19@2x.png)'}) 
				break
				case '카카오뱅크': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol18@2x.png)'})
				break
				case 'HMC투자증권': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol20@2x.png)'})
				break
				case '케이프투자증권': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol21@2x.png)'})
				break
				case 'NH투자증권': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol02@2x.png)'})
				break
				case '교보증권': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol22@2x.png)'})
				break
				case '대신증권': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol23@2x.png)'})
				break
				case '미래에셋대우': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol24@2x.png)'})
				break
				case 'DB금융투자': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol25@2x.png)'})
				break
				case '메리츠종합금융증권': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol26@2x.png)'})
				break
				case '부국증권': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol27@2x.png)'})
				break
				case '상섬증권': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol28@2x.png)'})
				break
				case '신영증권': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol29@2x.png)'})
				break
				case '신한금융투자': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol05@2x.png)'})
				break
				case '에스케이증권': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol30@2x.png)'})
				break
				case '유안타증권': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol31@2x.png)'})
				break
				case '유진투자증권': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol32@2x.png)'})
				break
				case '이베스트투자증권': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol33@2x.png)'})
				break
				case '키움증권': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol34@2x.png)'})
				break
				case '하나금융투자': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol00@2x.png)'})
				break
				case '한화투자증권': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol35@2x.png)'})
				break
				case 'KB증권': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol01@2x.png)'})
				break
				case '하이투자증권': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol09@2x.png)'})
				break
				case '한국투자증권': financeList.css({'backgroundImage':'url(/resource/untact/images/symbol36@2x.png)'})
				break
			}
		})
	}

	// 상품 체크리스트
	// var check_list_elements = document.querySelectorAll('.check_list li a')
	// check_list_elements.forEach(function(a){
	// 	console.count()
	// 	console.log(a)
	// })

	// @@ 추가
	// form tag INPUT서치에서 엔터키 검색
	$(".j_search_inputBox input[type='search']").on('keypress', function(e){
		if(e.type == 'keypress' && e.keyCode == 13){
			$(this).parents('.j_search_inputBox').find('.input_data_search').trigger('click')
		}

	})
	
	// $('.check_list li a').each(function(){ 20200708
		// $('.check_list li a').on('click', function(){
		// 	if(!$(this).parent().hasClass('on')){
		// 		if($(this).attr('check-target') === undefined){
		// 			$('.check_popup').fadeIn(200,'easeInOutCirc');
		// 			checkPopup.confirm($(this), $('.check_popup'));
		// 		}else if($(this).attr('check-target')){
		// 			var targetLeyar = $(this).attr('check-target')
		// 			$(targetLeyar).fadeIn(200,'easeInOutCirc');
		// 			checkPopup.confirm($(this), $(targetLeyar));
		// 		}
		// 	}
		// 	else if($(this).parent().hasClass('on')){
		// 		$('.cancel_popup').fadeIn(200,'easeInOutCirc');
		// 		checkPopup.cancel($(this), $('.cancel_popup'));
		// 	}
		// })
		// $('.check_list li .popup_open').on('click', function(){
		// 	if(!$(this).parent().hasClass('on')){
		// 		if($(this).attr('layer-target') === undefined){
		// 			checkPopup.confirm($(this), $('.check_popup'));
		// 		}else if($(this).attr('layer-target')){
		// 			var targetLeyar = $(this).attr('layer-target')
		// 			checkPopup.confirm($(this), $(targetLeyar));
		// 		}
		// 	}
		// })
	// })

	// 신청중인 상품 리스트 삭제
	if($(this).find('.applying_list').hasClass('applying_list') === true){
		applying_listCheck.listCheck($('.applying_list>li'))
		$('.applying_list').children('li').click(function(e){
			if($(e.target).attr('class') === 'list_del'){
				var targetLeyar = $(e.target).attr('layer-target')
				$(targetLeyar).show()
				checkPopup.remove(e.currentTarget, $(targetLeyar))
			}
		})
	}
	
	// 동의서 체크 디폴드0803 수정
	$("input[type='checkbox']").change(function(){
		if($(this).prop('checked') === true){
			if($(this).parents('.j_checkType01').hasClass('j_checkType01')){//상품서비스 안내수단
				checkType.checktype01($(this))
			} else if ($(this).attr("check-target")) { // 개인정보 수집 이용동의서 타켓
				var checkTarget = $(this).attr('check-target')
				$(checkTarget).prop('checked', true)
				$(checkTarget).prop('disabled', false)
				$(checkTarget).val('Y');// added DEV
				$(this).nextAll().children().find("input[type='checkbox']").prop('checked',true)
				if($(this).next().hasClass('j_setInput')){
					$(this).parents('.depth02_area').find('.j_setInput').parent().find("input[type='checkbox']").prop('checked',true)
				}
				checkType.checking($(this))
			} else {
				$(this).nextAll().children().find("input[type='checkbox']").prop('checked',true)
				checkType.checking($(this))
			}
		}else if($(this).prop('checked') !== true){
			if($(this).parents('.j_checkType01').hasClass('j_checkType01')){ //상품서비스 안내수단 
				checkType.checktype01($(this))
			} else if($(this).attr("check-target")){ // 개인정보 수집 이용동의서 타켓
				var targetname = $(this).attr('check-target')
				var checkTarget = $("input[check-target="+targetname+"]:checked")
				
				$(this).nextAll().children().find("input[type='checkbox']").prop('checked',false)
				if($(this).next().hasClass('j_setInput')){
					$(this).parents('.depth02_area').find('.j_setInput').parent().find("input[type='checkbox']").prop('checked',false)
					var RecheckTarget = $("input[check-target="+targetname+"]:checked")
					if(RecheckTarget.length === 0){
						$(targetname).prop('checked', false)
						$(targetname).attr('disabled', 'disabled')
					}
				}
				if(checkTarget.length === 0){
					$(targetname).prop('checked', false)
					$(targetname).attr('disabled', 'disabled')
					$(targetname).val('N');// added DEV
				}
				checkType.checking($(this))

			} else if ($(this).next().is('.j_check_notice')){ //손님권리 안내문 
				$(this).attr('disabled','disabled')
				var layerId = $(this).attr('layer-target')
				var checkTarget = $(this).attr('id')
				layerOpen.init(layerId);
				$("input[check-target="+"#"+checkTarget+"]").prop('checked', false)
				$("input[check-target="+"#"+checkTarget+"]").nextAll().children().find("input[type='checkbox']").prop('checked',false)
				checkType.checking($(this))
			} else {
				$(this).nextAll().children().find("input[type='checkbox']").prop('checked',false)
				checkType.checking($(this))
			}
		}
	})
	// 02 depth label
	$('.depth02_area > li > label').click(function(){
		var targetFor =  $(this).attr('for');
		var targetLayer = $('#'+targetFor).attr('layer-target');
		if($(this).prev().is(':checked') && $(targetLayer).length){
			layerOpen.init(targetLayer);
		}
	})
	// 01 depth label
	$('.depth01_area > li > label').click(function(){
		var targetFor =  $(this).attr('for');
		var targetLayer = $('#'+targetFor).attr('layer-target');
		if(!$(this).prev().is(':checked') && $(targetLayer).length){
			$(targetLayer).find('[data-agree]').attr('data-agree',false)
			layerOpen.init(targetLayer);
		}
		else if($(this).prev().is(':checked') && $(targetLayer).length){
			$(this).prev().prop('checked',false)
			$(this).parents('.j_check_all').removeClass('check_on')
			$(this).nextAll('.j-open_list').find("input[type='checkbox']").prop('checked',false)
			checkType.checking($(this).prev())
			bottomBtn.init();
		}else if($(this).prev().is(':checked') && $(targetLayer).length === 0){// 20200702 추가
			$(this).prev().prop('checked',false)
			$(this).nextAll('.j-open_list').find("input[type='checkbox']").prop('checked',false)
			$(this).siblings('.j-open_list.r_action').slideDown(400,'easeInOutSine'); 
		}else if(!$(this).prev().is(':checked') && $(targetLayer).length === 0){
			$(this).prev().prop('checked',true)
			$(this).nextAll('.j-open_list').find("input[type='checkbox']").prop('checked',true)
			$(this).siblings('.j-open_list.r_action').slideUp(400,'easeInOutSine'); 
		}
	})
	// allcheck btn
	// $('.toPopup').click(function(){
	// 	if(!$('.toPopup').prev().prop('checked')){
	// 		var agreelength = $(this).next().children().children("input[type='checkbox']");
	// 		for(var i = 0; i<agreelength.length; i++){
	// 			if(!agreelength[i].checked){
	// 				var targetId = agreelength[i].getAttribute('layer-target')
	// 				$('[data-agree]').attr('data-agree',true)
	// 				layerOpen.init(targetId)
	// 				return false
	// 			}
	// 		}
	// 	}else if($('.toPopup').prev().prop('checked')){
	// 		$(this).nextAll().children().find("input[type='checkbox']").prop('checked',false)
	// 		$('.toPopup').prev().prop('checked',false)
	// 		$(this).nextAll().find('.j_check_all').removeClass('check_on')
	// 		checkType.checking($(this))
	// 		bottomBtn.init();
	// 	}
	// })
	$('.toPopup').click(function(){
		if(!$('.toPopup').prev().prop('checked')){
			var targetFor =  $(this).attr('for');
			var targetLayer = $('#'+targetFor).attr('layer-target');
			if(!$(this).prev().is(':checked') && $(targetLayer).length){
				layerOpen.init(targetLayer);
			}
		}else if($('.toPopup').prev().prop('checked')){
			$(this).nextAll().children().find("input[type='checkbox']").prop('checked',false)
			$('.toPopup').prev().prop('checked',false)
			$(this).nextAll().find('.j_check_all').removeClass('check_on')
			checkType.checking($(this))
			bottomBtn.init();
		}
	})

	// 동의서 레이어팝업  // 20200706 수정
	$('.layerpopup [data-agree]').click(function(){
		var check_Id = $(this).parents('.layerpopup').attr('id')
		$("[layer-target=#"+check_Id+"]").prop('checked',true)
		if($("[layer-target=#"+check_Id+"]").siblings('.j-open_list').css('display') === 'none' && !$("[layer-target=#"+check_Id+"]").siblings('.j-open_list').hasClass('r_action')){
			$("[layer-target=#"+check_Id+"]").nextAll('.j-open_list').slideDown(400,'easeInOutSine');
		}
		if($("[layer-target=#"+check_Id+"]").siblings('.j-open_list.r_action').css('display') === 'block'){
			$("[layer-target=#"+check_Id+"]").siblings('.j-open_list.r_action').slideUp(400,'easeInOutSine'); 
		}
		for(var i = 0; i < $("[layer-target=#"+check_Id+"]").length; i++){
			if($("[layer-target=#"+check_Id+"]")[i].tagName !== 'input'){
				var parentEl = $("[layer-target=#"+check_Id+"]")[i].parentElement.querySelector('input[type="checkbox"]')
				$(parentEl).prop('checked',true)
			}
		}
		var targetlist = $("[layer-target=#"+check_Id+"]").nextAll('.j-open_list')
		$(targetlist).find("input[type='checkbox']").prop('checked',true)
		checkType.checking($("[layer-target=#"+check_Id+"]"))
		var popuplength = $('.depth01_area > li > input[layer-target]');
		// check_on 추가
		if($("[layer-target=#"+check_Id+"]").parents('.j_check_all').hasClass('j_check_all')){
			$("[layer-target=#"+check_Id+"]").parents('.j_check_all').addClass('check_on')
		}
		bottomBtn.init();
		if($(this).attr('data-agree') === 'true'){
			// for(var i = 0; i < popuplength.length; i++){
			// 	if(!popuplength[i].checked){
			// 		var targetId = popuplength[i].getAttribute('layer-target')
			// 		layerOpen.init(targetId)
			// 		return false
			// 	}
			// }
		}else if($(this).attr('data-agree') === 'all'){
			for(var i = 0; i < popuplength.length; i++){
				$(popuplength[i]).prop('checked',true)
			}
			$("[layer-target=#"+check_Id+"]").siblings('.depth01_area').find('.j-open_list').slideDown(400,'easeInOutSine');
			$("[layer-target=#"+check_Id+"]").siblings('.depth01_area').find('.j-open_list').find("input[type='checkbox']").prop('checked',true)
			$("[layer-target=#"+check_Id+"]").siblings('.depth01_area').find('.j_check_all').addClass('check_on');
		}
	})

	// 레이어 팝업 내 컨텐츠 포지션 이동
	$('[data-position-to]').click(function(e){
		let clicked_El = e.target.dataset.positionTo
		let move_position = document.querySelector('[data-position-from='+clicked_El+']')
		let layerId = e.target.getAttribute('layer-target')
		layerOpen.movePoint(layerId, move_position);
	})
	// 평생계좌 번호 신청
	$('[data-fromaccount]').click(function(){
		var accountNum = $(this).parents('.layerpopup').find('.input_form02.on .input_data').val()
		var inputId = $(this).attr('data-fromaccount')
		$('#'+inputId).removeClass('input_placeholder').text(accountNum)
	})

	// 보안매체 선택
	$('body').on('click', '.j_typeOfOtp a' ,function(e) {
		e.preventDefault();
		var targetParents = e.currentTarget.closest('.j_typeOfOtp')
		selectOfElement.selected(e.currentTarget, targetParents)
	})

	// 계좌추가 선택
	$('body').on('click', '.j_typeOfAccount a' ,function(e) {
		e.preventDefault();
		var targetParents = e.currentTarget.closest('.j_typeOfAccount')
		selectOfElement.selected(e.currentTarget, targetParents)
	})
	
	// OTP 선택
	$('body').on('click', '.j_selectOfOtp a' ,function(e) {
		e.preventDefault();
		//OPT 팝업 Get data 변수
		var fromTarget = e.currentTarget.hash;
		var otpTitle = e.currentTarget.querySelector('.tit');
		var otpNumber = e.currentTarget.querySelector('.num');
		
		//OPT set data 변수
		var toTarget = document.querySelector(fromTarget);
		var toTitle = toTarget.querySelector('.tit');
		var toNumber = toTarget.querySelector('.num');
		
		//실행코드
		$(toTarget).slideDown(200,'easeInOutCirc');
		toTitle.innerHTML = otpTitle.innerHTML
		toNumber.innerHTML = otpNumber.innerHTML
	})

	// 출금계좌 추가 
	// $('body').on('change', '.j_selectOfAccountList input[type="checkbox"]' ,function(e) {
	// 	var targetInput = e.currentTarget; // 현재 타깃
	// 	var targetParent = e.currentTarget.closest('.j_selectOfAccountList'); //타깃 부모
	// 	var moveToElement = targetParent.getAttribute('element-target'); // 타깃 속성 
	// 	var listArea = document.querySelector(moveToElement) //리스트 영역
	// 	var targetId = targetInput.getAttribute('id')//타깃 아이디
	// 	var targetName = targetInput.nextElementSibling.querySelector('.account_name') //타깃 data
	// 	var targetNumber = targetInput.nextElementSibling.querySelector('.account_num') //타깃 data
	// 	if(targetInput.checked){    
	// 		var newElementLi = document.createElement('li'); //li 생성
	// 		var newElementTit = document.createElement('p'); //p 생성
	// 		var newElementNum = document.createElement('p'); //p 생성
			
	// 		newElementTit.className = 'tit'; //p 클래스 추가
	// 		newElementTit.innerText = targetName.innerText; // data 삽입
			
	// 		newElementNum.className = 'num'; //p 클래스 추가
	// 		newElementNum.innerText = targetNumber.innerText; // data 삽입

	// 		newElementLi.className = targetId; //li 클래스 추가
	// 		newElementLi.appendChild(newElementTit) //li안에 p.tit 생성
	// 		newElementLi.appendChild(newElementNum) //li안에 p.num 생성
	// 		listArea.appendChild(newElementLi) //리스트 영역에 li 생성
	// 	}else if(!targetInput.checked) {
	// 		var deleteLi = listArea.querySelector('.'+targetId); //해당 ID와 같은 CLASS 엘리멘트
	// 		deleteLi.remove(); //삭제 실행
	// 	}
	// })
	// $('body').on('click', '.j_selectOfAccount button' ,function(e) {
	// 	var moveToElement = e.currentTarget.getAttribute('element-target'); //실행될 엘리멘트 타겟
	// 	var targetElement = document.querySelectorAll(moveToElement); //실행될 엘리멘트 타겟
	// 	// targetElement.style.display = 'block'; //
	// 	$(targetElement).slideDown(200,'easeInOutCirc');
	// })
	// 출금계좌 추가 or 삭제
	// $('#accountAllcheck').click(function(e){
	// 	if(!e.currentTarget.checked === true){
	// 		$('#selectedAccount').children().remove();
	// 	}else if(e.currentTarget.checked === true){
	// 		$('#selectedAccount').children().remove();
	// 		$('.j_selectOfAccountList input[type="checkbox"]').prop('checked', false);
	// 		$('.j_selectOfAccountList label').trigger('click');
	// 	}
	// })

	// 1원 추가인증 
	// var currentVal = 0;
	// $('.check_money .input_data').on('keyup keypress',function(){
	// 	var inputValue = $(this).val();
	// 	var valueLength = inputValue.length;
	// 	if(valueLength < 4){
	// 		if(currentVal < valueLength){
	// 			for(var i = 0; i < valueLength-currentVal; i++){
	// 				$('.check_number').append(
	// 					"<span></span>"
	// 				);
	// 			}
	// 			currentVal = valueLength;
	// 		}else if(valueLength < currentVal){
	// 			for(var j = 0; j < currentVal - valueLength; j++){
	// 				$('.check_number').children().last().remove();
	// 			}
	// 			currentVal = valueLength;
	// 		}
	// 	}
		
	// })
	// 출금계좌 토클
	$('.toggle_btn').each(function(){
		$(this).click(function(){
			var _this = $(this);
			if(!$(this).hasClass('on')) {
				$(this).addClass('on')
				$(this).parents('li').find('.account_list').slideDown({
					progress: function(){
						if (layerScroll[scrollArr.indexOf('#' + _this.parents('.layerpopup').attr('id'))] != undefined) {
							layerScroll[scrollArr.indexOf('#' + _this.parents('.layerpopup').attr('id'))].update();
						}
					},
					duration: 200,
					easing: 'easeInOutSine'
				})
			}else if($(this).hasClass('on')) {
				$(this).removeClass('on')
				$(this).parents('li').find('.account_list').slideUp({
					progress: function(){
						if (layerScroll[scrollArr.indexOf('#' + _this.parents('.layerpopup').attr('id'))] != undefined) {
							layerScroll[scrollArr.indexOf('#' + _this.parents('.layerpopup').attr('id'))].update();
						}
					},
					duration: 200,
					easing: 'easeInOutSine'
				})
			}
		})
	})

	//하단 버튼 노출
	bottomBtn.init();

	var padEl = []; //보안키패드 담을 배열
	var safePw= 'transkey_'// ID 보안 INPUT 
	var safePad= 'mtk_' //ID 보안키패드
	$('.input_txt').off('click').on('click',function(e){ 
		var _id = e.target.getAttribute('id') // 클릭된 Elements
		var isID = document.querySelector('#'+safePw+_id)
		var padID = document.querySelector('#'+safePad+_id)
		if(isID){
			if(padEl.indexOf(padID.getAttribute('id')) === -1){
				padEl.push(padID.getAttribute('id')); 
			}
		}
		$('#'+padEl).each(function(){
			$(this).children().on('touchend',function(e){
				var _thisInput = $(this).parent().attr('id');
				var inputName = _thisInput.substring(safePad.length,_thisInput.length)
				if($('#'+inputName).val().length > 0){
					$('#'+inputName).addClass('check_on')
				}
			})
		})
	})


	//오토포커싱 라벨 클릭 
	$('.input_form').on('click','.input_title',function (e) {
		var _this = $(this).parents('.input_form');
		var _thisLabel = $(this).attr('for')
		var inputThis = e.currentTarget.getAttribute('for');
		if(_this.hasClass('disabled')){
			return false;
		}else{
			_this.addClass('on');
			// console.log()
			setTimeout(function() {
				if (!_this.hasClass('focus')) {
					_this.addClass('focus');
				}
			},200);
			_this.find('.input_form').eq(0).trigger('click');
		}
	});

	//오토포커싱 포커스, 키 이벤트
	// 20200616 수정 
	$('.input_form .input_data').on('click focusin focusout keypress',function(e) {
		var _this = $(this);
		if(_this.parents('.input_form').hasClass('disabled')){
			return false;
		}else if (e.type == 'focusin' || e.type == 'click') {
			// 20200713
			$('.input_form').removeClass('focus');
			_this.parents('.input_form').addClass('focus');
			setTimeout(function() {
				inputTxt.init(_this);
			},110);
			if (_this.parents('.input_form').nextAll('.j_focus').eq(0).length == 0) {
				if(_this.text().length > 0 && e.target.tagName ==='DIV'){
					_this.parents('.input_form_group').nextAll('.j_focus_group').eq(0).show();
				}else if (_this.val().length >= 0 && e.target.tagName ==='INPUT') {
					_this.parents('.input_form_group').nextAll('.j_focus_group').eq(0).show();
				}
			}
		}else if (e.type == 'focusout') {
			setTimeout(function() {
				bottomBtn.init();
			},100);
			if($(e.target).hasClass('j_next_focus')){
				if (_this.parents('.input_form').nextAll('.j_focus').eq(0).length > 0) {
					if($(e.target).parents('.input_form').next('.j_focus').eq(0).find('.input_data').text().length <= 0 && $(e.target).parents('.input_form').next('.j_focus').eq(0).find('.j_focus_open').length > 0){
						$(e.target).parents('.input_form').next('.j_focus').eq(0).find('.j_focus_open').trigger('click');
					}else{
						$(e.target).parents('.input_form').next('.j_focus').eq(0).find('.j_input_value').trigger('focus');
					}
				}else if (_this.parents('.input_form_group').nextAll('.j_focus_group').eq(0).length > 0) {
					if($(e.target).parents('.input_form_group').next('.j_focus_group').eq(0).find('.j_focus').eq(0).find('.input_data').text().length <= 0 && $(e.target).parents('.input_form_group').next('.j_focus_group').eq(0).find('.j_focus').eq(0).find('.j_focus_open').length > 0){
						$(e.target).parents('.input_form_group').next('.j_focus_group').eq(0).find('.j_focus').eq(0).find('.j_focus_open').trigger('click');
					}else{
						$(e.target).parents('.input_form').next('.j_focus').eq(0).find('.j_input_value').trigger('focus');
					}
				}
			}
		}else if (e.type == 'keypress') {
			if(e.keyCode == 13){
				_this.siblings('.j_data_del').hide();
				focusMove.init($(this));
			}
		}
	});
	$('.input_form .input_data').on("keyup", function(){
		setTimeout(function() {
			bottomBtn.init();
		},120);
	});

	// $('input:password').on('click',function() {
	// 	$('body').css({'margin-top':'-10rem'});
	// });

	$('.input_form .input_data').on('focusin',function() {
		$('body').find('.btn_fix').css({'position':'static','margin-top':'8rem'}, 500);
		// console.log('포커스 인');
	});	

	// 포커스 아웃 시 j_focus 삭제
	$('.input_form .input_data').on('focusout',function() {
		if($(this).parents().hasClass('j_phone') == false){
			var _this = $(this);
            _this.parents('.input_form').removeClass('j_focus');
		}
        $('body').find('.btn_fix').css({'position':'fixed','margin-top':'0'}, 500);
    });



    checkMobile();

    $('.full_pop .input_form .input_data').on('focusin',function() {
		$('body').css({'margin-top':'0','padding-bottom':'0'});
		$('body').find('.btn_fix').css({'position':'fixed','margin-top':'0'});
	});
	
	$('#tempBzRegNo').on('focusin',function() {
		$('body').find('.conect_page .btn_area').css({'display':'none'});
	});

	$('#tempBzRegNo').on('focusout',function() {
		$('body').find('.conect_page .btn_area').css({'display':'block'});
	});

    $('.layerpopup .input_form .input_data').on('focusin',function() {
		$('body').css({'margin-top':'0'});
	});

	//체크 박스, 라디오 포커스
	$('.input_form, .j_focus02').on('change, click','.j_input_check',function(e) {
		let _this = $(this)
		let	_thisParent = $(this).parents('.input_form,.j_focus02')
		let _inputTarget = $(this).attr('input-target');
		// S 20200629 수정
		$('input:radio').each(function(){
			if($(this).attr('name') === _this.attr('name')){
				$(this).parents('.input_form,.j_focus02').removeClass('on');
			}
		})
		// E 20200629 수정
		// $('input:radio').prop('name',_this.attr('name')).parents('.input_form,.j_focus02').removeClass('on'); 삭제
		if ($(this).prop('checked')) {
			_thisParent.addClass('on');
			$(this).addClass('check_on');
			setTimeout(function() {
				// 20200616 수정
				if(_this.find('.j_focus').length > 0) {
					_thisParent.addClass('focus');
				}

				if ($(_inputTarget).prop('tagName') == 'INPUT') {
					$(_inputTarget).trigger('focus');
				}else {
					$(_inputTarget).trigger('click');
				}
			},100);
		}else {
			_thisParent.removeClass('focus');
			$(this).removeClass('check_on');
			setTimeout(function() {
				_thisParent.removeClass('on');	
			},100);
		}

		// if (layerScroll[scrollArr.indexOf('#' + _this.parents('.layerpopup').attr('id'))] != undefined) {
		// 	layerScroll[scrollArr.indexOf('#' + _this.parents('.layerpopup').attr('id'))].update();
		// 	layerScroll[scrollArr.indexOf('#' + _this.parents('.layerpopup').attr('id'))].translateTo(0,0);
		// }

		bottomBtn.init();
	});

	//input 텍스트 지우기 
	$('.j_data_del').on('touchstart click',function(e) {
		e.preventDefault();

		$(this).siblings('.input_data,.j_input_modify').removeClass('check_on').val('').trigger('focus');
		
			
		$('.j_email_layer').hide();
		bottomBtn.init();
	});

	//input 입력시 
	$('.j_input_value').on('click focusin focusout keyup',function(e) {
		var _this = $(this);
		if (e.type == 'keyup') {
			inputTxt.init($(this));
			layerEmail.init($(this));
		}
		if(e.type == 'focusin') {
			$('.j_data_del').hide();
			
			if (!_this.parents('.input_form,.j_focus02').hasClass('focus')) {
				_this.parents('.input_form,.j_focus02').addClass('focus');
			}
			inputTxt.init($(this));
		}else if (e.type == 'focusout') {
			$('.input_form,.j_focus02').removeClass('focus');
			setTimeout(function() {
				$('.j_data_del').hide();
			},200);
		}
	});

	//셀렉트 선택
	$('body').on('click','.j_select li a',function(e) {
		e.preventDefault();
		var targetId = $(this).attr('href'),
			txt = $(this).text(),
			_thisSelectSlide = $(this).parents('.j_select_slide'),
			_thisSelectCont = $(this).parents('.j_select_slide_cont'),
			slideIndex = _thisSelectSlide.index() + 1;

		if (_thisSelectCont.is(':animated')) {
			return false;
		}

		$(targetId).removeClass('input_placeholder');
		if ($(targetId).prop('tagName') == 'INPUT') {
			$(targetId).val(txt).addClass('check_on');
		}else {
			$(targetId).text(txt).addClass('check_on');
		}
		// 20200715 s
		if (_thisSelectSlide.length > 0) {
			if ($(this).parents('.j_select_slide_cont').find('.j_select_slide').length == slideIndex) {
				layerClose.init(this);
			}else if($(targetId).parents('.input_form').nextAll('.j_focus').eq(0).length > 0){
				var moveIndex = $(targetId).parents('.input_form').nextAll('.j_focus').eq(0).find('.input_data').attr('layer-slide-index')
				_thisSelectCont.stop().animate({'left' : -_thisSelectCont.find('.j_select_slide').width()*moveIndex},400,'easeInOutCirc');
			}else{
				layerClose.init(this);
			}
		}else {
			layerClose.init(this);
		}
		// 20200715 e
		if(!$(targetId).parents('.input_form').hasClass('on')){
			$(targetId).parents('.input_form').addClass('on');
		}

		$('.input_form,.j_focus02').removeClass('focus');
		if ($(this).hasClass('j_layer_open')) {
			layerClose.init(this);
		}else {
			focusMove.init($(targetId));
		}

		if($(e.target).parents('.j_email_layer')){
			$(e.target).parents('.j_email_layer').slideUp()
		}
	});

	//토글
	$('.j_toggle').on('click','.j_toggle_open',function(e) {
		var _this = $(this);
		$(this).siblings('.j_toggle_cont').slideToggle({
			progress: function(animation,progress) {
				if (layerScroll[scrollArr.indexOf('#' + _this.parents('.layerpopup').attr('id'))] != undefined) {
					layerScroll[scrollArr.indexOf('#' + _this.parents('.layerpopup').attr('id'))].update();
				}
			},
			duration: 200,
			easing: 'easeInOutCirc'
		}).parents('.j_toggle').toggleClass('on');
	});

	//포커스 이동
	$('.j_focus_move').on('click',function(e) {
		e.preventDefault();
		if ($('.layerpopup').is(':animated')) {
			return false;
		}
		var _this = this;
		if ($(this).attr('move-target') != undefined) {
			_this = $(this).attr('move-target');
		}
		focusMove.init($(_this));
	});

	//버튼 텍스트 변경
	$('.j_btn_toggle').on('click',function(e) {
		e.preventDefault();
		$(this).text($(this).attr('toggle-text'));
	});

	//사업장 주소 가져오기
	$('.j_address').on('click',function(e) {
		$(this).siblings('.input_form').addClass('on');
	});

	//input 수정 입력시 
	$('.j_input_modify').on('click focusin focusout keyup keypress',function(e) {
		var _this = $(this);
		if (_this.prop('disabled')) {
			return false;
		}
		if (e.type == 'keyup') {
			inputTxt.init(_this);
		}
		if(e.type == 'focusin') {
			$('.j_data_del').hide();
			
			if (!_this.parents('.input_form, .j_focus02').hasClass('focus')) {
				_this.parents('.input_form, .j_focus02').addClass('focus');
			}
			inputTxt.init(_this);
		}else if (e.type == 'focusout') {
			$('.input_form, .j_focus02').removeClass('focus');
			setTimeout(function() {
				$('.j_data_del').hide();
				if (!_this.parents('.input_form, .j_focus02').hasClass('focus')) {
					_this.prop('disabled','disabled').siblings('.j_data_modify').show();
				}
			},200);
		}else if (e.type == 'keypress') {
			if(e.keyCode == 13){
				$('.j_data_del').hide();
				$('.input_form, .j_focus02').removeClass('focus');
				_this.prop('disabled','disabled').siblings('.j_data_modify').show();
			}
		}
		// 2020-03-27 추가 (신분증 확인 Input)
		bottomBtn.init();
	});

	// 2020-09-28 추가
	/*$('.inpSlice .j_input_modify').each(function(n){
		console.log(n);
		$(this).on('click focusin focusout keyup keypress',function(e) {
			var _this = $(this);
			var itemChk = $('.inpSlice.slice4');
			if (e.type == 'keyup' || e.type == 'focusin') {
				itemChk.find('.j_data_del').show();
				itemChk.find('.j_data_del').addClass('on');
			}
			if (e.type == 'focusout') {
				setTimeout(function() {
					//$('.j_data_del').hide();
					if (!_this.parents('.input_form, .j_focus02').hasClass('focus')) {
						$('.inpSlice .j_input_modify').prop('disabled','disabled');
						itemChk.find('.j_data_modify').show();
						itemChk.find('.j_data_del').hide();
						itemChk.find('.j_data_del').removeClass('on');
					}
				},200);
			}
		});
	});*/

	//input 수정 토글 2020-09-28 수정
	$(document).on('click','.j_data_modify',function() {
		$(this).hide().siblings('.j_input_modify').prop('disabled','').focus();

	});

	//input 수정 토글 2020-09-28 추가
	/*$(document).on('click','.inpSlice.slice4 .j_data_modify',function() {
		$('.inpSlice').find('.j_input_modify').prop('disabled','');
		$('.inpSlice.slice1').find('.j_input_modify').focus();
		$('.inpSlice .j_data_del').show();
		$('.inpSlice .j_data_del').addClass('on');
	});*/

	//class 추가 
	$('.j_target_on').on('click',function() {
		$(this).toggleClass('on');
	});

	//리스트 토글
	$('.j_toggle_list').on('click','.j_toggle_open',function() {
		var _this = $(this);
		$(this).parents('li').addClass('on').siblings().removeClass('on').find('.j_toggle_cont').slideUp(200,'easeInOutCirc');
		$(this).siblings('.j_toggle_cont').slideDown({
			progress : function() {
				//$('body').scrollTop(_this.offset().top - 51);	
			},
			duration: 200,
			easing: 'easeInOutCirc'
		});
		$(this).siblings('.j_toggle_cont').promise().done(function() {
			if (layerScroll[scrollArr.indexOf('#' + _this.parents('.layerpopup').attr('id'))] != undefined) {
				layerScroll[scrollArr.indexOf('#' + _this.parents('.layerpopup').attr('id'))].update();
			}
			if ($(this).parents('.j_scroll').length > 0) {
				layerScroll[scrollArr.indexOf('#' + _this.parents('.layerpopup').attr('id'))].translateTo( -(_this.offset().top - ($(this).parents('.j_toggle_list').offset().top ) + 20),500);
			}else {
				$('body').animate({
					'scrollTop' : _this.offset().top - 51
				},500);
			}
		});
	});

	// 2021.05.25 개발요청 삭제
	// $('.j_toggle_modify').on('click',function() {
	// 	if ($(this).text() == '수정') {
	// 		$(this).text('저장');
	// 		$(this).parents('li').addClass('modify').find('.j_modify').removeClass('disabled').prop('disabled','');
	// 	}else {
	// 		$(this).text('수정');
	// 		$(this).parents('li').removeClass('modify').find('.j_modify').addClass('disabled').prop('disabled','disabled');
	// 	}
	// });

	//
	$(document).on('click',function(e) {
		if (!$(e.target).parents('.j_email_layer').length > 0 && !$(e.target).hasClass('j_email')) {
			$('.j_email_layer').slideUp(200,'easeInOutCirc');
		}
	});

	//탭이동
	$('.tabs li').each(function(){
        $(this).click(function(){
			var _this = $(this);
            $(this).addClass('on').siblings().removeClass('on')
			$(this).parents('.tab_area').siblings('.tab_cont_area').find('.tabcont').eq($(this).index()).show().siblings('.tabcont').hide();
			setTimeout(function() {
				if (layerScroll[scrollArr.indexOf('#' + _this.parents('.layerpopup').attr('id'))] != undefined) {
					layerScroll[scrollArr.indexOf('#' + _this.parents('.layerpopup').attr('id'))].update();
					if ($(this).parents('.j_scroll').length > 0) {
						layerScroll[scrollArr.indexOf('#' + _this.parents('.layerpopup').attr('id'))].translateTo(0,0);
					}										
				}
			},100);
			
        })
	});

	// 2021.06.15 Update 추가정보 토글
    $('.form_toggle_wrap .toggle_tit').each(function(){
		$(this).unbind('click');
		$(this).bind('click',function(){
			
			var toggle_cont = $(this).parents('.form_toggle_wrap');

			if(toggle_cont.is('.active') == true){
				toggle_cont.removeClass('active');
				$('.toggle_cont').slideUp(200);
			} else {
				toggle_cont.addClass('active');
				$('.toggle_cont').slideDown(200);
			}
	    });
	});

	// 2021.06.21 보안키패드시 스크롤 
	// $(".input_txt input[type='password']").each(function(){
	// 	$(this).unbind('click');
	// 	$(this).bind('click',function(){
	// 		if($(this).parents('.input_form').hasClass('focus') == true) {
	// 			var _offset = $(this).offset().top;
	// 			console.log('offset : ' +' '+_offset );
	// 			$('html, body').stop().animate({scrollTop : _offset - 85}, 400);
	// 		}
			
	// 	})
	// });
	
});

window.onload = function(){
	var haiSwiper = new Swiper('.hai_slide', {
		pagination: {
			el: '.swiper-pagination',
		}
	});
	function scrollDown(){
		var windowSize = $(window).height();
		var bodySize = $('body').height();
		$('html,body').stop().animate({scrollTop : bodySize-windowSize}, 600, 'easeInOutCubic')
	}
	// scrollDown()
	// 20200708
	$("[data-standard-to]").off().on('click', function(e){
		var target_layer = $(e.currentTarget).attr('layer-target')
		// $(target_layer).find("[data-standard-from]").attr('data-standard-from', $(e.currentTarget).attr('data-standard-to'))
		var standardLayer = document.querySelector(target_layer)
		var transferEl = standardLayer.querySelectorAll('.auto_Transfer')
		for(var n = 0; n < transferEl.length; n++){
			var initialslide;
			if($(transferEl[n]).attr('data-standard-from') === undefined){
				initialslide = 0
			}else if($(transferEl[n]).attr('data-standard-from') !== undefined){	
				var transferDate = new Date();
				var days = transferDate.getDate();
				var daylabel = transferDate.getDay();
				if($(transferEl[n]).hasClass('j_data')){
					initialslide = days - 1;
				}else if($(transferEl[n]).hasClass('j_weekday')){
					if(daylabel === 0){
						initialslide = 6;
					}else{
						initialslide = daylabel - 1;
					}
				}else{
					initialslide = $(transferEl[n]).attr('data-standard-from')
				}
			}
			if(!$(transferEl[n]).hasClass('run')) {
				$(transferEl[n]).addClass('run')
				var peroidSelect = new Swiper(transferEl[n], {
					direction : 'vertical',
					slidesPerView: 3,
					spaceBetween: 0,
					centeredSlides: true,
					freeMode: true,
					freeModeMinimumVelocity:0.5,
					freeModeSticky: true,
					height: 210,
					initialSlide: initialslide,
					on: {
						slideChange: function (){
							// 슬라이드 이동후 문제생길시 여기에 다시 만들기
						}
					}
				});
			}else if($(transferEl[n]).hasClass('run')){
				transferEl[n].swiper.update();
			}
		}
	})
	
	$('.transfer_selection').on('touchend',function(e){
		var hasSecondSlide = $(this).find('.swiper-slide-active').attr('data-slide-to')
		if(hasSecondSlide !== undefined){
			$(this).parents('.transfer_period').find('.auto_Transfer').removeClass('on').hide();
			$(this).parents('.transfer_period').find('.transfer_selection').addClass('on').removeClass('showOne').show();
			$(this).parents('.transfer_period').find("[data-slide-from="+hasSecondSlide+"]").addClass('on').show();
		}else{
			$(this).parents('.transfer_period').find('.auto_Transfer').removeClass('on').hide();
			$(this).parents('.transfer_period').find('.transfer_selection').addClass('on showOne').show();
		}
	})

	$('.j_periodCheck').off().on('click', function(e){
		var checked_result = $(e.target).attr('data-resultChk');
		var this_layer_id = 'j_getData_' + $(this).parents('.layerpopup').attr('id');
		var isBoolean = (checked_result === "true")
		var _moveTo = $(e.target).attr('data-moveTo');
		if(isBoolean){
			var targetNum = $(this).parents('.layerpopup').find('.auto_Transfer.on.j_get_txt').find('.swiper-slide-active')
			var targetTxt = '';
			for(var i = 0; i < targetNum.length; i++){
				targetTxt += targetNum[i].innerText + ' ';
			}
			$('.'+this_layer_id).parents('.txt_notice02').show();
			$('.'+this_layer_id).text(targetTxt).addClass('check_on')
		}else if(!isBoolean){
			$('.'+this_layer_id).parents('.txt_notice02').hide();
			$('.'+this_layer_id+'.input_data').show().text('신청안함').addClass('check_on');
		}
		var sendClass = $(e.target).parents('.layerpopup').find('.transfer_selection').find('.swiper-slide-active').attr('data-send-class')
		if($('.'+this_layer_id).next().hasClass(sendClass)){
			$('.'+sendClass).trigger('click')
			
		}else if($(e.target).attr('data-moveTo')){
			focusMove.init($("#"+_moveTo));
		}
	})


	var focusTabs = document.querySelectorAll('[data-when-to]')
	for(var j = 0; j < focusTabs.length; j++){
		focusTabs[j].addEventListener('click', function(e){
			var _addPart = 'j_subCont_';
			var _id = e.currentTarget.closest('.layerpopup').getAttribute('id');
			var isClass = document.querySelector('.'+_addPart+_id);
			var toData = e.currentTarget.getAttribute('data-when-to');
			var fromData = isClass.getAttribute('data-when-from');
			if(Array(isClass).length > 0){
				var isInputData = isClass.querySelectorAll('.input_data')
				if(toData === fromData){
					isClass.classList.add('j_focus_group');
					isClass.style.display = 'block';
					for(var n = 0; n < isInputData.length; n++){
						if(isInputData[n].disabled === false) {
							isInputData[n].classList.add('j_check_all');
						}
					}
				}else{
					isClass.style.display = 'none';
					isClass.classList.remove('j_focus_group');
					for(var n = 0; n < isInputData.length; n++){
						isInputData[n].classList.remove('j_check_all');
					}
				}
			}
		})
	}

	
	function layerHeight(layer){
		var windowHeigh = window.clientHeight
		$(layer).css({'min-height': windowHeigh})
	}
	layerHeight('.layerpopup')

	
	//레이어 열기
	$('.j_layer_open').on('click',function(e) {
		if ($('.layerpopup').is(':animated')) {
			return false;
		}

		if ($(this).hasClass('disabled')) {
			return false;
		}
		// 20200708 추가
		if($(this).parent().hasClass('input_select')){
			$(this).parents('.input_form').addClass('on')
		}

		var layerId = $(this).attr('layer-target'),
			layerIndex = $(this).attr('layer-slide-index');

		// $('.input_form,.j_focus02').removeClass('focus');
		// $(this).parents('.j_focus,.j_focus02').addClass('focus'); // 확인필요

		if ($(layerId).find('.hai_slide').length > 0) {
			setTimeout(function() {
				haiSwiper.update();
			},100);
		}
		if($(e.currentTarget).hasClass('j_layer_open')){
			layerOpen.init(layerId,layerIndex);
		}
	});

	//레이어 닫기
	$('.j_layer_close').on('click',function() {
		// if ($('.layerpopup').is(':animated')) {
		// 	return false;
		// }
		
		layerClose.init(this);
	});
	$('.j_layer_all_close').on('click',function() {
		// if ($('.layerpopup').is(':animated')) {
		// 	return false;
		// }
		layerClose.init(this,'all');
	});

	// setTimeout( function(){ window.scrollTo(0, 1); }, 100 );
		
	// guide_section 버튼 위치
	var browserHeight = $(window).height();  
	var contentHeight = $('.guide_section').outerHeight();  
	if(browserHeight < contentHeight){
		$('.guide_section').css({'position':'relative'})
		$('.btn_fix').css({'position':'absolute'}) 
	}

	// 딤클릭시 팝업닫힘
	// $('.layerpopup').on('click',function(e){
	// 	if($(e.target).parent('.layerpopup').hasClass('on')){
	// 		layerClose.init(e.target);
	// 	}
	// })

	// 인트로페이지 특정영역 높이값 측정
	if($('.wrapper').find('.go_center').hasClass('go_center') === true){
		if($('.wrapper').find('.point_position').hasClass('tpye01') === true){
			$('.go_center').height($('.point_position').offset().top)
		}
		if($('.wrapper').find('.point_position').hasClass('tpye02') === true){
			var _thisEl = document.querySelector('.go_center')
			$('.go_center').height($(window).height()-_thisEl.offsetTop)
		}
	}

	// console.log(window.performance.timing.domComplete);
	var loadTime = window.performance.timing.domComplete; //Dom loading Time
	var realtime = loadTime.toString(); // change to type of String
	var checkingTime = Number(realtime.substring(0,3)) // change to type of Number
	// console.log(checkingTime);
	// if($('.wrapper').find('.first_intro').hasClass('first_intro') === true){
	// 	setTimeout(function(){
	// 		$('.first_intro').addClass('on')
	// 	},500);
	// }
	if($('.wrapper').find('.loading_dot').hasClass('loading_dot') === true){
		for(var i = 0; i < $('.loading_dot span').length; i++){
			(function(x) {
				setTimeout(function() {
					$('.loading_dot span').eq(x).addClass('on')
				}, 200*x);
			})(i);
		}

	}

	// 상단 자동 스크롤
	function upScrollStart(){
		window.scrollTo({top:0})
		$('body').css('min-height',0)
		$('html,body').css('overflow','');
		$('.contents,.layerpopup,.pop_tit').off('touchmove');
		
		if(!$('body').hasClass('noAction')){
			if ($('.wrapper').hasClass('j_up_scroll')) {
				$('.wrapper').on('scroll click touchstart touchmove',function(e) {e.preventDefault();});
				$('body').css('min-height',$('html').height() +  ($('#upScroll').offset().top - 51));
				setTimeout(function() {
					$('html,body').stop().animate({scrollTop : $('#upScroll').offset().top - (51+35)},600,'easeInOutCubic'); //35는 상단 간격
					setTimeout(function() {
						$('.wrapper').off('scroll click touchstart touchmove');
						if ($('.j_focus_group').eq(0).find('.j_focus').eq(0).find(' .j_focus_open').length > 0) {
							$('.j_focus_group').eq(0).find('.j_focus').eq(0).find(' .j_focus_open').trigger('click');
						}else {
							$('.j_focus_group').eq(0).find('.j_focus').eq(0).find('j_input_value').eq(0).trigger('focus');
						}
					},400);
				},1500 + checkingTime);
			}	
		}
	}

	upScrollStart();
	productListPage();
	swiperInSwiper();

	// 법인정보 사업자명(영문) 삭제/삭제취소
	$('.in_fixed_btn .txt_btn.j_line').on('click',function() {
		$(this).parent('.in_fixed_btn').toggleClass('j_line_through');
		$(this).toggleClass('on');
		if($(this).hasClass('on')) {
			$(this).text($(this).attr('toggle-text'));
		} else {
			$(this).html('삭제');
		}
	});

}
// 20200717s
function layer_90_Height(target_layer){
	if ($(target_layer).find('.layer_90').length > 0) {
		var popH = 0;
		if ($(target_layer).find('.pop_fix_area').length > 0) {
			popH = $(target_layer).find('.pop_tit').height() +  $(target_layer).find('.pop_fix_area').height();
		} else {
			popH = $(target_layer).find('.pop_tit').height();
		}
		$(target_layer).find('.j_scroll').height($(target_layer).find('.layer_contents').height() - popH);
	}
}

function productListPage(){
	var menu = ['입출금통장', '예금', '적금', '전자금융', '외환']
	var targetPage = document.querySelector('.j_swiperArea');
	var scrollBar = document.querySelector('.j_swiperSelectArea .swiper-pagination');
	if(document.querySelector('.j_swiperArea .swiper-notification') === null){
		var usePage = new Swiper(targetPage, {
			speed: 300,
			spaceBetween: 30,
			autoHeight: true,
			pagination:{
				el: '.swiper-pagination',
				clickable: true,
				renderBullet: function(index, className){
					return '<li class="'+className+'"><a href="#none">'+(menu[index])+'</a></li>';
				},
			},
			on: {
				init:function(){
					var toperHeight = targetPage.parentElement.offsetTop;
					var elementsSlide = targetPage.querySelectorAll('.swiper-slide');
					for(var i = 0; i < elementsSlide.length; i++){
						elementsSlide[i].style.height = window.innerHeight - toperHeight;
						var areaHeight = elementsSlide[i].children[0].clientHeight;
						var liElementsNumArr = elementsSlide[i].children[0].children;
						var liElementHeight = elementsSlide[i].children[0].firstElementChild.clientHeight;
						var sumHeight = [];
						for(var n = 0; n < liElementsNumArr.length; n++){
							sumHeight.push(liElementsNumArr[n].clientHeight)
						};
						results = sumHeight.reduce(function(a, b){
							return a + b;
						});
						if(areaHeight < results){
							elementsSlide[i].children[0].lastElementChild.style.paddingBottom = 10+'rem';
						}else if(areaHeight > results){
							elementsSlide[i].children[0].lastElementChild.style.paddingBottom = 1.5+'rem';
						}
					}
					targetPage.firstElementChild.style.height = window.innerHeight - toperHeight;	
				},
				slideChange: function(){
					targetPage.querySelector('.swiper-slide-active').scrollTop = 0;
					var scrollBartabs = scrollBar.querySelectorAll('li');
					var scrollBartabsWidth = scrollBartabs[scrollBartabs.length-1].offsetLeft + scrollBartabs[0].offsetLeft + scrollBartabs[0].offsetWidth;
					var moveWidth = (scrollBartabsWidth - scrollBar.clientWidth) / (scrollBartabs.length - 1)
					document.querySelector('.j_swiperSelectArea .swiper-pagination').scrollTo({
						top: 0,
						left: this.activeIndex * moveWidth,
						behavior: 'smooth'
					})
				},
			},
		})
	}
}

function swiperInSwiper(){
	setTimeout(function(){
		var j_frame = new Swiper('.j_frame_swiper', {
			direction: 'vertical',
			slidesPerView: 'auto',
		});
	},400)
}

// 아이폰일 때 script
function checkMobile() {
    var userA = navigator.userAgent.toLowerCase();
    if(userA.indexOf('iphone')>-1 || userA.indexOf('ipod')>-1 || userA.indexOf('ipad')>-1){
    	// 아이폰일 때 
    	// console.log('아이폰입니다');

    	// var _offset = $('.input_form:first-of-type').offset().top;


    	// 포커스 인일 때 키패드 여백
	    $('.input_form .input_data').on('focusin',function() {
	    	$('body').css({'padding-bottom':'30rem'});
	    	// console.log(_offset);
	    	// $('body').stop().animate({scrollTop : _offset - 110}, 100);
		});	

	    $('.input_form .input_data').on('focusout',function() {
	        var _this = $(this);
	        if(!_this.hasClass('focus')){
	        	// $('body').css({'padding-bottom':'0'});
	            $('body').css({'padding-bottom':'0'});
	        }
	    });
		

	    return 'ios';
    }
}