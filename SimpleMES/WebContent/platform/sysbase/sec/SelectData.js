var id=geturl("rightIframe","id");
var roleId=geturl("rightIframe","roleId");
console.log(roleId);

    var zTree;
    var demoIframe;
    var setting = {
        check: {
        	autoCheckTrigger:false,
    		chkboxType: { "Y": "ps", "N": "ps" },
    		chkStyle: "checkbox",
            enable: true //是否可选中
        },
        view: {
            dblClickExpand: false,//双击节点时，是否自动展开父节点的标识
            showLine: true,//设置 zTree 是否显示节点的图标。
            selectedMulti: false//设置是否允许同时选中多个节点。
        },
        data: {
            simpleData: {
            	//如果设置为 true，请务必设置 setting.data.simpleData 内的其他参数: idKey / pIdKey / rootPId，并且让数据满足父子关系。
                enable:true,//使用简单数据模式
                idKey: "id",//唯一标识名称
                pIdKey: "pid",//父节点唯一标识名称
                rootPId: 1000//。[setting.data.simpleData.enable = true 时生效]
            }
        },
        callback: {
        	
        	//用于捕获单击节点之前的事件回调函数，并且根据返回值确定是否允许单击操作
            beforeClick: function(treeId, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj("rtree");
              // var demoIframe=$("#rightIframe");
               zTree.expandAll(true);
                
                if (treeNode.isParent) {
                    zTree.expandNode(treeNode);
                 //   demoIframe.attr("src","http://www.baidu.com");
                    return true;
                } else {
        			
                   // demoIframe.attr("src","selectRole.html?id="+treeNode.id+"&roleId="+roleId);
                    return true;
                }
            },
            beforeRename:function(treeId,treeNode){
            	console.log("修改触发函数"+"treeid=   "+treeId+",treenode=   "+treeNode);
            },
            beforeRemove:function(treeId,treeNode){
            	console.log("删除触发函数"+"treeid=   "+treeId+",treenode=   "+treeNode);
            }
            
        },
        edit:{
        	enable :true,
        	showRemoveBtn : false,
        	showRenameBtn : false
        }
    };

  

    $(document).ready(function(){
        var t = $("#rtree");
        var url  = "../../../dynamic/ObjStructure/funTreeDataById?id="+id;
		$.getJSON(url,function(result1){
	        t = $.fn.zTree.init(t, setting,result1.dataset.treenode);
	        var url1  = "../../../dynamic/ObjStructure/funTreeSelectedData?roleId="+roleId;
	        $.getJSON(url1,function(result){
	        	for(var i=0;i<result1.dataset.treenode.length;i++){
	        		var idd= result1.dataset.treenode[i].id;
					var idArray = result.dataset.tree.split(",");
					for (var j = 0; j < idArray.length; j++) {
						var id = idArray[j];
						if(idd==id){
							 var node = t.getNodeByParam("id",idd);
							 node.checked = true;
							 t.updateNode(node);
						}
					}
	        	}
				
	        });
		});
		
		
    });

    jQuery(function($){
    	$('#saveBtn').on('click',function(){
    		var treeObj = $.fn.zTree.getZTreeObj("rtree");
			 nodes=treeObj.getCheckedNodes(true);
	         var ids="";
	         for(var i=0;i<nodes.length;i++){
	        	 ids+=nodes[i].id + ",";
	            //console.log(nodes[i].id); //获取选中节点的值
	         }
	         var url  = "../../../dynamic/Security/authorizeRole";
		     $.post(url, { roleId:roleId , funIds:ids , treeId:id }, function(result) {
		    	 BootstrapDialog.alert(result.message);
				}, "json");  
		})
    });
    
  function loadReady() {
  		console.log(demoIframe);
        var bodyH = demoIframe.contents().find("body").get(0).scrollHeight,
                htmlH = demoIframe.contents().find("html").get(0).scrollHeight,
                maxH = Math.max(bodyH, htmlH), minH = Math.min(bodyH, htmlH),
                h = demoIframe.height() >= maxH ? minH:maxH ;
        if (h < 1000) h = 530;
        demoIframe.height(h);
    }
  
//获取所有的传过来的参数
function geturl(id,name) {
    var reg = new RegExp("[^\?&]?" + encodeURI(name) + "=[^&]+");
    var arr = window.parent.document.getElementById(id).contentWindow.location.search.match(reg);
    if (arr != null) {
        return decodeURI(arr[0].substring(arr[0].search("=") + 1));
    }
    return "";
}
