package com.sgepit.fileAndPublish.control;

import java.util.List;

import com.sgepit.fileAndPublish.dao.ComFileInfoDAO;
import com.sgepit.fileAndPublish.hbm.ComFileInfo;
import com.sgepit.fileAndPublish.service.IComFileManageService;
import com.sgepit.frame.base.Constant;

public class ComFileManageDWR {
	private IComFileManageService comFileManageService;

	public ComFileManageDWR() {
		comFileManageService = (IComFileManageService) Constant.wact
				.getBean("ComFileManageService");

	}

	public boolean reportSelectedFiles(String[] filePks, Integer reportStatus,
			Boolean transfer) {
		try {
			comFileManageService.reportSelectedFiles(filePks, reportStatus,
					transfer);
		} catch (Exception e) {
			return false;
		}
		return true;
	}
	
	public boolean deleteUnsavedFileAttatchment(String fileUids){
		try {
			comFileManageService.deleteUnsavedFileAttatchment(fileUids);
		} catch (Exception e) {
			return false;
		}
		return true;
	}

	public boolean cancelTrans(String fileLsh) {
		return comFileManageService.cancelTrans(fileLsh);
	}

	public boolean transToZLS(String fileLshs, String fileNames, String fileId,
			String zlSortId, String userId) {
		return comFileManageService.transToZLS(fileLshs, fileNames, fileId,
				zlSortId, userId);
	}

	public String filesPublishToDept(String publishUserId,
			String publishDeptId, String[] fileIds, String deptIds, Boolean doExchange) {
		return comFileManageService.filesPublishToDept(publishUserId,
				publishDeptId, fileIds, deptIds, doExchange);
	}

	public String filesPublishToUser(String publishUserId,
			String publishDeptId, String[] uidArr, String userIdArrStr, Boolean doExchange) {
		return comFileManageService.filesPublishToUser(publishUserId,
				publishDeptId, uidArr, userIdArrStr, doExchange);
	}

	/**
	 * 根据id获取，在发布查询页面打开文件详细信息窗口使用
	 * 
	 * @param filePk
	 * @return
	 */
	public ComFileInfo findById(String filePk) {
		return comFileManageService.getFileInfoById(filePk);
	}

	/**
	 * 删除文件
	 * 
	 * @param filePk
	 * @return
	 */
	public boolean deleteFile(String filePk) {
		return comFileManageService.deleteFile(filePk);
	}

	/**
	 * 批量删除
	 * 
	 * @param filePks
	 * @return
	 */
	public boolean deleteSelectedFiles(String[] filePks) {
		return comFileManageService.deleteSelectedFiles(filePks);
	}

	public boolean changeUserReadState(String userId, String filePk,
			String state) {
		return comFileManageService.changeUserReadState(userId, filePk, state);
	}
	
	/**
	 * 将用户的所有未读文件标记为已读
	 * 
	 * @param userId 用户id
	 * @return true 表示成功， false表示失败
	 */
	public boolean markAllAsReadForUser(String userId, String sortId){
		return comFileManageService.markAllAsReadForUser(userId, sortId);
		
	}

	/**
	 * 批量标记已读
	 * 
	 * @param userId
	 * @param filePks
	 * @param read
	 * @return
	 */
	public boolean markSelectedFilesAsRead(String userId, String[] filePks,
			Boolean read) {
		return comFileManageService.markSelectedFilesAsRead(userId, filePks,
				read);
	}

	/**
	 * 获取未读消息数量
	 * 
	 * @param userId
	 * @param deptId
	 * @return
	 */
	public Integer getUnreadMsgNum(String userId, String deptId) {
		return comFileManageService.getUnreadMsgNum(userId, deptId);
	}
	
	/**
	 * 获取文件的附件数量
	 * 
	 * @param fileUids 文件uids
	 * @return 附件数量
	 */
	public Integer getFileAttachCount(String fileUids){
		return comFileManageService.getFileAttachCount(fileUids, false);
	}

	/**
	 * 更新文件名（使用了“重新上传”功能后调用）
	 * 
	 * @param filePk
	 *            文件主键
	 * @param fileName
	 *            文件名（包含扩展名）
	 */
	public void updateFileName(String filePk, String fileName) {
		ComFileInfoDAO comFileInfoDAO = ComFileInfoDAO.getInstance();
		List<ComFileInfo> list = comFileInfoDAO.findByProperty("fileLsh",
				filePk);
		if (list.size() > 0) {
			ComFileInfo curFile = list.get(0);
			//找到扩展名“.”的位置
			int extIdx = fileName.lastIndexOf(".");
			if ( extIdx == -1 ){
				curFile.setFileName(fileName);
				curFile.setFileTile(fileName);
			}
			else{
				String fileTitle = fileName.substring(0, extIdx);
				String fileExt = fileName.substring(extIdx + 1);
				
				curFile.setFileName(fileTitle);
				curFile.setFileTile(fileTitle);
				curFile.setFileSuffix(fileExt);
			}
			
//			String[] fileNameArr = fileName.split("\\.");
//			curFile.setFileName(fileNameArr[0]);
//			curFile.setFileTile(fileNameArr[0]);
//			if (fileNameArr.length > 1) {
//				curFile.setFileSuffix(fileNameArr[1]);
//			}

			comFileInfoDAO.saveOrUpdate(curFile);
		}

	}

	/**
	 * 获取未读消息数量,发布与上报之和
	 * @param pid项目单位
	 * @param userId
	 * @param deptId
	 *@param rootIdPublish项目单位模块根节点
	 *@param rootIdUpload项目单位模块根节点
	 * @return
	 */
	public Integer getUnreadMsgNumTotal(String pid,String userId, String deptId,String rootIdPublish,String rootIdUpload) {
		return comFileManageService.getUnreadMsgNumTotal(pid,userId, deptId, rootIdPublish, rootIdUpload);
	}	
	/**
	 * 将用户上报的所有未读文件标记为已读
	 * 
	 * @param userId 用户id
	 * @param sortId 文件分类ID
	 * @param pid 项目单位ID
	 * @return true 表示成功， false表示失败
	 */
	public boolean markAllAsReadForUserUpload(String userId, String sortId,String pid){
		return comFileManageService.markAllAsReadForUserUpload(userId, sortId,pid);
		
	}
	/**
	 * 获取未读消息数量,发布到当前节点的
	 * @param userId
	 * @param deptId
	* @param rootId项目单位模块根节点
	 * @return
	 */
	public Integer getUnreadMsgNumPublish(String userId, String deptId,String rootId) {
		return comFileManageService.getUnreadMsgNumPublish(userId, deptId,rootId);
	}	
	/**
	 * 获取未读消息数量,上报到当前节点的
	 * @param pid项目单位
	 * @param userId
	 * @param deptId
	* @param rootId项目单位模块根节点
	 * @return
	 */
	public Integer getUnreadMsgNumUpload(String userId, String deptId,String rootId) {
		return comFileManageService.getUnreadMsgNumUpload(userId, deptId,rootId);
	}
	/**
	 * 根据模块名称，用户主键获取模块的URL
	 * @param moduleName模块名称
	 * @param userId
	 * @return
	 */
	public String getModuleUrlByUserId(String moduleName,String userId){
		return comFileManageService.getModuleUrlByUserId( moduleName, userId);
	}
	/**
	 * 根据模块id，用户主键获取模块的URL
	 * @param moduleName模块名称
	 * @param userId
	 * @return
	 */
	public String getModuleUrlByUserModouleId(String powerPk,String userId){
		return comFileManageService.getModuleUrlByUserModouleId(powerPk, userId);
	}
	/**
	 * 根据集团删除分类模块时，下发分类的项目单位也对应删除
	 * @param fileArr模块流水号 
	 * @param unitId项目单位编号 
	 * @param businessType模块类型
	 * @param blobTable大对象表名称
	 * @param beanName模板主表名称
	 * @return
	 */
	public String deleteFileByUnitId(String fileArr[],String unitId[],String businessType,String blobTable,String beanName){
		return comFileManageService.deleteFileByUnitId(fileArr, unitId,businessType,blobTable,beanName);
	}
	/**
	 * 招投标模块文件移交资料室
	 * @param userdeptid
 	 * @param uesrid
	 * @param type
	 * @param fileMap
	 * @param fileId
	 * @param zlSortId
	 * @param userId
	 * @return
	 */
	public boolean transToZLSByType(String userdeptid,String userid,String type,String fileLshs, String fileNames, String fileId,
			String zlSortId, String userId) {
		return comFileManageService.transToZLSByType(userdeptid,userid,type,fileLshs, fileNames, fileId,
				zlSortId, userId);
	}
	
	/**
	 * 批量回收
	 * 
	 * @param filePks
	 * @return
	 */
	public boolean recycleSelectedFiles(String[] filePks) {
		return comFileManageService.recycleSelectedFiles(filePks);
	}	

	/**
	 * 批量删除
	 * @param filePks	comfileinfo主键数组
	 * @return
	 */
	public boolean deleteReformNotice(String[] filePks) {
		return comFileManageService.deleteReformNotices(filePks);
	}

	/**
	 * 获取文件的附件数量
	 * @param fileUids 文件uids
	 * @return 附件数量
	 */
	public Integer getReformFileAttachCount(String fileUids){
		return comFileManageService.getReformFileAttachCount(fileUids);
	}

	/**
	 * 上报、审批
	 * @param uids	RrformNoticInfo主键
	 * @param reportState 要改变的状态
	 * @return
	 */
	public boolean reportReformNotice(String[] uids, String reportState) {
		return comFileManageService.reportReformNotices(uids, reportState);
	}

	/**
	 * 向部门发送短信
	 * @param userName	发送人ID
	 * @param userDept	发送人部门
	 * @param toDeptIds	发送到部门
	 * @param uids		短信内容对应数据的主键
	 * @return	true 成功，false 失败
	 */
	public String sendSmsToDept(String userName, String userDept, String toDeptIds, String uids) {
		return comFileManageService.sendSmsToDept(userName, userDept, toDeptIds, uids);
	}

	/**
	 * 向用户发送短信
	 * @param userName	发送人ID
	 * @param userDept	发送人部门
	 * @param toUsers	发送到用户
	 * @param uids		短信内容对应数据的主键
	 * @return	true 成功，false 失败
	 */
	public String sendSmsToUser(String userName, String userDept, String toUsers, String uids) {
		return comFileManageService.sendSmsToUser(userName, userDept, toUsers, uids);
	}

}
