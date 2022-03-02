/*****************************************************************************
 * 파일명 : ibk-csw-untact-untact100.js
 * 작성일 : 2021. 03. 02
 * 작성자 : 김이준
 * 설 명 : 비대면 실명확인 - 자격검증 - 개인정보입력 (실명인증)
 * ===========================================================================
 * 변경이력:
 * DATE				AUTHOR		DESCRIPTION
 * ---------------------------------------------------------------------------
 * 변경 이력은 이곳에 추가 합니다.
 *****************************************************************************/

ibk.csw.untact.untact430 = function(){
	var map = "";
	var oldMarkers = new Array();	// 마커 호출시 초기화 위함
	var mapLoadYN = false;	// MAP 그려진 상태 유무 (map 한번만 호출하기 위함)
	var infowindow = new Array();	// 말풍선 초기화를 위함
	
	return{
		
		// 영업점 리스트
		branchList : function(searchNm){
			var url = "";
			if(SERVER_SECTION == "dev" || SERVER_SECTION == "stg"){				
				url = "https://openhanafn.ttmap.co.kr:8443/hanafn_json.jsp?query="+searchNm+"&company_code=01&branch_type=1";
			}else{
				url = "https://openhanafn.ttmap.co.kr/hanafn_json.jsp?query="+searchNm+"&company_code=01&branch_type=1";
			}
			$.ajax({
				url: url, // "https://api.github.com",
				async: false,
				dataType : "json",
				success : function(data){
					var branchListData = data.list;
					if(oldMarkers.length > 0){
						ibk.csw.untact.untact430.removeMarker(oldMarkers);
					}
					if(branchListData != ""){
						var count = branchListData.length;
						var positionArr = new Array();
						var positionArr2 = new Array();
						
						for(var idx = 0; idx < count; idx ++){
						//	alert(branchListData[idx].branch_code.length + "//"+branchListData[idx].name);
							if($.trim(branchListData[idx].branch_code) != ""){
								var data = new Object();
								data.name			 = branchListData[idx].name;				//영업점명
								data.branch_code = branchListData[idx].branch_code;	//영업점 코드
								data.address 		 = branchListData[idx].address;			//영업점 주소
								data.x = Number(branchListData[idx].position_x)/1000000;
								data.y = Number(branchListData[idx].position_y)/1000000;
								positionArr.push(data);
							}

						}
						// 개발 / 품질 중복 데이터 제거
						if(SERVER_SECTION == "dev" || SERVER_SECTION == "stg"){
							/* 중복제거 */
							var name =[];
							var branch_code =[];
							var address =[];
							var x =[];
							var y =[];
							$.each(positionArr, function(key , item){
								
								if(name.indexOf(item.name) === -1 && branch_code.indexOf(item.branch_code) === -1 && address.indexOf(item.address) === -1 && (x.indexOf(item.x) === -1 || y.indexOf(item.y) === -1)){
									name.push(item.name);
									branch_code.push(item.branch_code);
									address.push(item.address);
									x.push(item.x);
									y.push(item.y);
								}
								
							});
							
							$.each(name, function(key , item){
								var data = new Object();
								data.name			 = name[key];				//영업점명
								data.branch_code = branch_code[key];	//영업점 코드
								data.address 		 = address[key];			//영업점 주소
								data.x =x[key];
								data.y = y[key];
								
								positionArr2.push(data);
								
							});
							if($('.branch_list').hide()) $('.branch_list').show();
							if($('.adress_dis').show()) $('.adress_dis').hide();
							ibk.csw.untact.untact430.setMarker(positionArr2);
						}else{
							//운영일때 중복제거 하지 않고 PASS
							if($('.branch_list').hide()) $('.branch_list').show();
							if($('.adress_dis').show()) $('.adress_dis').hide();
							ibk.csw.untact.untact430.setMarker(positionArr);
						}
					
						
						
					}else{
						$('.branch_list').hide();
						$('.adress_dis').show();
					}
			
				},
				error : function(httpRequest){
					hanaDialog.openAlert({title:"알림", message:"TTMAP 연결 ERROR : " + httpRequest.responseText});
				}
			});

		},
		myLoction : function(){
			
			var geoLocation = navigator.geolocation;
			geoLocation.getCurrentPosition(function(position){
				navigator.geolocation.getCurrentPosition(function (pos){
					ibk.csw.untact.untact430.changeAddr(pos.coords);
				});
			},function(error){
				if(error.code == "1"){ // 사용자가 거부 시 하나은행 본점 이동
					ibk.csw.untact.untact430.branchList("영업1부PB센터");
				}
				//alert("error : " + error.code);
			});
			
		},
		changeAddr : function(locationData){
			
			var mapChangeCoder = new kakao.maps.services.Geocoder();
			
			mapChangeCoder.coord2RegionCode(locationData.longitude, locationData.latitude  , function(result){
				//address_name , region_3depth_name 주소
				var url = "";
				var myAddrss =  result[0].address_name;
				
				ibk.csw.untact.untact430.branchList(myAddrss);
			});
	        
		},
		mapLoad : function(statusYn){ // 처음 MAP 그릴떄만 호출
			
			var mapContainer = document.getElementById('map');
			mapOption = {
				center : new kakao.maps.LatLng(37.566400, 126.981886)
				,level : 7
			};
			
			map = new kakao.maps.Map(mapContainer, mapOption);
			mapLoadYN = true;
			if("Y" == statusYn){ // 위치정보 동의 이면 내위치
				var searchNm = $('#gomap').text();
				if(searchNm != "" && searchNm != undefined){
					$('#stdIndsClasNm').val(searchNm);
					ibk.csw.untact.untact430.branchList(searchNm);
				}else{
					ibk.csw.untact.untact430.myLoction();
				}
				
			}else{
				ibk.csw.untact.untact430.branchList("영업1부PB센터"); // 미동의 일시 로직
			}
			
        	
		},setMarker : function(data){
			/* 기존 말풍선 있는지 체크후 있으면 삭제*/
			if(infowindow.length > 0){
				$.each(infowindow,function(index,item){
					
					infowindow[index].close();
				});
				
			}
			var infowin = new kakao.maps.InfoWindow({zIndex:1});
			/*새로 MAP 로드할때 말풍선 지우기 위한 로직*/
			infowindow.push(infowin);
			var bounds = new kakao.maps.LatLngBounds();
			map.panTo(new kakao.maps.LatLng(data[0].y, data[0].x));
			
			$.each(data,function(index,item){
				marker = new kakao.maps.Marker({
	        		map: map,
	        		position: new kakao.maps.LatLng(item.y, item.x),
	        		title: item.name,
	        		level : 3
				});
				bounds.extend(marker.getPosition());
				oldMarkers.push(marker);
				
				kakao.maps.event.addListener(marker, "click",makeOverListener(map,marker,infowin,item.branch_code,item.address));
				$(".branch_list").find("ul").append("<li data-index="+index+"><a onclick=getData('"+item.name+"','"+item.branch_code+"');><strong>"+item.name+"</strong><p>"+item.address+"</p></a></li>");
				
			});
			map.setBounds(bounds);
		},removeMarker: function(markerList){
			if(0 < markerList.length){
				for(var i=0; i< markerList.length; i++){
					markerList[i].setMap(null);					
				}
			}
			
		}, agreeCheck: function(statusYn){
			
			$("#layerpopup01").hide();
			if($("#layerpopup01").hide()){
				layerOpen.init('#layerpopup02');
				if(!mapLoadYN){
					setTimeout(function(){ibk.csw.untact.untact430.mapLoad(statusYn);}, 400);
				}else{
					
					if("N" == statusYn){
						$('#stdIndsClasNm').val("영업1부PB센터");
						$('#sicSearchButton').click();
//						ibk.csw.untact.untact430.branchList("영업1부PB센터");
					}else{
						var searchNm = $('#gomap').text();
						if(searchNm != "" && searchNm != undefined){
							$('#stdIndsClasNm').val(searchNm);
							$('#sicSearchButton').click();
							//ibk.csw.untact.untact430.branchList(searchNm);
						}else{
							ibk.csw.untact.untact430.myLoction();
						}
					}
					
				}
			}	

		}, goSubmit : function(formObj){
			if($("#branchCode").val() == "" || $("#branchNm").val() == ""){
				hanaDialog.openAlert({title:"알림", message:"영업점을 선택해 주세요"});
				return false;
			}else{
				var hanaJQuery = new HanaJQuery(null, true);
				hanaJQuery.ajaxSubmit('/untact/csuntact431.do', formObj, function(httpRequest, textStatus){
					msb.util.form.sendForm(formObj, '/untact/csuntact440.do');
				});
			}
			
		}
	}		
		/*layerpopup02*/
	
}();
function makeOverListener(map,marker,infowindow , branch_code ,address){
	return function(){
		/* 말풍선 */
		infowindow.close();
		
		var str = '<div style="padding:5px;font-size:12px;">'+marker.getTitle()+'</div>';
		infowindow.setContent(str);
		infowindow.open(map, marker);
		
		/*선택 하시겠습니까 confirm alert으로 요청 할떄*/
//		var strHtml = marker.getTitle()+"지점을 선택하시겠습니까?";
//		ibk.csw.common.openConfirm(strHtml
//				, getData( marker.getTitle() , branch_code)
//				, function(){
//			layerOpen.init('#layerpopup02'); // 아니요 눌렀을떄 다시 지도팝업 호출
//			
//		});

		var idx = 0;
		/* 선택한 index 찾기*/
		$(".branch_list").find("ul li").each(function(index,item){
			var name = $(this).find("strong").text();
			if(marker.getTitle() == name){
				idx = $(this).data("index");				
			}
		});
		/* 아래 li 스크롤 이동 로직 위 each 문 이름 비교문 안으로 넣으면됨 */
//		 var thisOffset = $(this).offset().top - 150; // 타켓 위치값
//		    
//         $('.swiper-wrapper').css({
//             'transform':'translateY('+'-'+thisOffset+'px)', //translate 이동
//             'transition':'.8s' //animate
//         });
		
		/*  리스트 정렬순서 변경*/
		$(".branch_list").find("ul li").each(function(index,item){
			var index =  $(this).data("index");
			if(idx == $(this).index()){
				 $(this).data("index",0);
			}else if(idx > $(this).index()){
				$(this).data("index", index+1);
			}

				//$(".branch_list").find("ul li").eq(0).before("<li><a onclick=getData('"+marker.getTitle()+"','"+branch_code+"');><strong>"+marker.getTitle()+"</strong><p>"+address+"</p></a></li>");
				
			
		});
		// 정렬 실제 화면 변경
		$(".branch_list").find("ul").each(function(){
			var liList = $(this).children("li");
			liList.sort(function(a,b){
				return $(a).data("index") -$(b).data("index");
			}).appendTo($(this));
		});
		   
		
	}
}
function getData(name , branch_code ){
	//alert("Test" + name + "/"+ branch_code);
	
	$("#callagree").addClass('on');
	$("#gomap").text(name);
	$("#branchCode").val(branch_code);
	$("#branchNm").val(name);
	
	$("#layerpopup02").hide();
}
//# sourceURL=ibk-csw-untact-untact100.js