package com.sgepit.fileAndPublish.control;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sgepit.fileAndPublish.FAPConstant;
import com.sgepit.fileAndPublish.dao.ComFileInfoDAO;
import com.sgepit.fileAndPublish.service.IComFileSortService;
import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.util.JdbcUtil;

public class ComFileSortDWR {
	//public static final String SPLITC = "|";
	//public static final String SPLITD = "``";
	private IComFileSortService comFileSortService;
	
	

	public ComFileSortDWR(){
		comFileSortService = (IComFileSortService) Constant.wact
		.getBean("ComFileSortService");
	}
	
	/**
	 * @param nodeId  节点ID
	 * @param deptId  部门ID
	 * @param rightType 权限类型 FAPConstant 中指定的类型
	 * @param rightValue 权限值
	 * @return
	 */
	public boolean setComFileSortNodeRightAlone(String nodeId,String deptId,String rightType,String rightValue){
		//查找以该节点为根节点的分类树
		List<Map> list = new ArrayList<Map>();
		String sql = "select unitid,unit_type_id from " +
				"(select unitid,unit_type_id from sgcc_ini_unit  start WITH unitid = '"+deptId+"' connect by PRIOR unitid = upunit) " +
				"where unit_type_id <> '9'" ;
		list = JdbcUtil.query(sql);	
		String rightStr = "";
		if(rightType.equals(FAPConstant.right_ReadOnly) && rightValue.equals("false")){
			for(int i=0;i<list.size();i++){
				Map map = list.get(i);
				rightStr += FAPConstant.SPLITA + map.get("unitid").toString() + FAPConstant.SPLITB +FAPConstant.right_None;
			}
			rightStr = rightStr.substring(1);
			
		}else if(rightType.equals(FAPConstant.right_Write) && rightValue.equals("true")){
			for(int i=0;i<list.size();i++){
				Map map = list.get(i);
				rightStr += FAPConstant.SPLITA + map.get("unitid").toString() + FAPConstant.SPLITB +FAPConstant.right_Write;
			}
			rightStr = rightStr.substring(1);
		}else{
			for(int i=0;i<list.size();i++){
				Map map = list.get(i);
				rightStr += FAPConstant.SPLITA + map.get("unitid").toString() + FAPConstant.SPLITB +FAPConstant.right_ReadOnly;
			}
			rightStr = rightStr.substring(1);
		}
		
		List<Map> nodeList = comFileSortService.getComFileSortTreeByParentId(nodeId, null);	
		for(int i=0;i<nodeList.size();i++){
			this.setComFileSortNodeRight(nodeList.get(i).get("uids").toString(), rightStr);
		}
		return true;
		
	}
	/**
	 * 设置节点权限
	 * @param nodeId  节点ID
	 * @param rightStr  格式示例：部门ID1`权限类型1|部门ID2`权限类型2|部门ID3`权限类型3|部门ID4`权限类型4
	 * @return
	 */
	public boolean setComFileSortNodeRight(String nodeId,String rightStr){
		Map<String,String> rightMap = new HashMap<String,String>();
		String[] rightArr = rightStr.split("["+FAPConstant.SPLITA+"]");
		for(int i=0;i<rightArr.length;i++){
			String[] rightDetai = rightArr[i].split(FAPConstant.SPLITB);
			rightMap.put(rightDetai[0], rightDetai[1]);
		}
		
		return comFileSortService.setComFileSortNodeRight(nodeId, rightMap);
	}
	/**
	 * 删除节点前进行验证，如果该节点下（包括以他为根节点的分类树）已经添加了文件，则不允许删除该节点。
	 * @param nodeId
	 * @return
	 */
	public boolean deleteVerification(String nodeId){
		
		List<Map> list = comFileSortService.getComFileSortTreeByParentId(nodeId, null);
		for(int i=0;i<list.size();i++){
			Map map = list.get(i);
			String sortUids = map.get("uids").toString();
			ComFileInfoDAO fileInfoDAO = ComFileInfoDAO.getInstance();
			List fineInfoList = fileInfoDAO.findWhere("file_sort_id = '"+sortUids+"'");
			if(fineInfoList.size()>0){
				return false;
			}
		}
		return true;
	}
	/**
	 * 删除节点
	 * @param nodeId
	 * @return
	 */
	public boolean deleteNode(String nodeId){
		
		return comFileSortService.deleteNode(nodeId);
	}
	public String getNewSortBh(String parentId){
	
		return comFileSortService.getNewSortBhByParentId(parentId); 
	}
	
	public String issueFileSort(String rootId) {
	
		return comFileSortService.issueFileSort(rootId);
		
	}
	

	public String setSyncStatus(String nodeId, Boolean sync)
			throws BusinessException {
		String message = "success";
		try {
			comFileSortService.setSyncStatus(nodeId, sync);
			
		} catch (BusinessException e) {
			
			e.printStackTrace();
			message = e.getMessage();
		}
		return message;
		
	}
	
	/*@param权限设置函数，勾选表示有查看及读的权限，取消勾选表示无权限
	 * @param nodeId  节点ID
	 * @param deptId  部门ID
	 * @param rightType 权限类型 FAPConstant 中指定的类型
	 * @param rightValue 权限值
	 * @return
	 */
	public boolean setComFileSortNodeRightAll(String nodeId,String deptId,String rightType,String rightValue){
		//查找以该节点为根节点的分类树
		List<Map> list = new ArrayList<Map>();
		String sql = "select unitid,unit_type_id from " +
				"(select unitid,unit_type_id from sgcc_ini_unit  start WITH unitid = '"+deptId+"' connect by PRIOR unitid = upunit) " +
				"where unit_type_id <> '9'" ;
		list = JdbcUtil.query(sql);	
		String rightStr = "";
		if(rightType.equals(FAPConstant.right_Write) && rightValue.equals("false")){
			for(int i=0;i<list.size();i++){
				Map map = list.get(i);
				rightStr += FAPConstant.SPLITA + map.get("unitid").toString() + FAPConstant.SPLITB +FAPConstant.right_None;
			}
			rightStr = rightStr.substring(1);
			
		}else if(rightType.equals(FAPConstant.right_Write) && rightValue.equals("true")){
			for(int i=0;i<list.size();i++){
				Map map = list.get(i);
				rightStr += FAPConstant.SPLITA + map.get("unitid").toString() + FAPConstant.SPLITB +FAPConstant.right_Write;
			}
			rightStr = rightStr.substring(1);
		}
		
		List<Map> nodeList = comFileSortService.getComFileSortTreeByParentId(nodeId, null);	
		for(int i=0;i<nodeList.size();i++){
			this.setComFileSortNodeRight(nodeList.get(i).get("uids").toString(), rightStr);
		}
		return true;
		
	}	
	/*@param选择的下发单位
	 * @param unitids单位
	 * @param rootId
	 * @return
	 */
	public String issueFileSortBySelect(String unitids[],String rootId) {	
		return comFileSortService.issueFileSortBySelect(unitids,rootId);	
	}
		
}
