package com.sgepit.fileAndPublish.service;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sgepit.fileAndPublish.hbm.ComFileInfo;
import com.sgepit.fileAndPublish.hbm.ComFilePublishHistory;
import com.sgepit.fileAndPublish.hbm.ReformNoticeInfo;
import com.sgepit.fileAndPublish.hbm.ReformNoticeInfoView;

public interface IComFileManageService {
	/**
	 * 获取符合查询条件的所有文档信息
	 * 
	 * @param sortIds
	 *            分类节点ID，多个用CAFConsatan.SPLITB进行分割
	 * @param showType
	 *            数据格式 是否显示自分类数据-是否显示无权限访问的数据 1-1：显示该分类及他所有子分类下所有的文档；
	 *            1-0：显示该分类及他所有自分类下的且该用户具备访问权限的所有文档；
	 * @param deptIds
	 *            其他辅助过滤条件
	 * @return
	 */
	public List<ComFileInfo> getComFileInfoBySortId(String sortIds,
			String whereStr, String orderby, Integer start, Integer limit);

	/**
	 * 保存从本地上传的新文件
	 * 
	 * @param comFileInfo
	 * @param inputStream
	 * @return
	 */
	public String saveNewFile(ComFileInfo comFileInfo, InputStream inputStream);

	/**
	 * 删除对应分类下所有的文件
	 * 
	 * @param sortId
	 * @return
	 */
	public boolean deleteAllFilesBySort(String sortId);

	/**
	 * 批量删除
	 * 
	 * @param filePks
	 * @return
	 */
	public boolean deleteSelectedFiles(String[] filePks);

	/**
	 * 删除单个文件
	 * 
	 * @param filePk
	 * @return
	 */
	public boolean deleteFile(String filePk);

	public ComFileInfo getFileInfoById(String uids);

	/**
	 * 获取未读消息数
	 * @param userId	用户ID
	 * @param deptId	用户所属部门ID
	 * @return
	 */
	public Integer getUnreadMsgNum(String userId, String deptId);
	
	/**
	 * 根据用户及相关查询条件，获取发布到用户及用户所在部门的信息
	 * 
	 * @param dateSelected 日期范围
	 * @param stateSelected 状态（已读/未读/全部）
	 * @param userId 用户ID
	 * @param deptId 用户所在部门ID
	 * @param whereStr 过滤条件字符串
	 * @param orderBy 排序字段
	 * @return
	 */
	public List<ComFilePublishHistory> getFileListByPublish(
			String dateSelected, String stateSelected, String userId,
			String deptId, String whereStr, String keyword ,String orderBy, Integer start,
			Integer limit);

	/**
	 * 改变文件已读状态
	 * @param userId
	 * @param filePk
	 * @param state
	 * @return
	 */
	public boolean changeUserReadState(String userId, String filePk,
			String state);

	/**
	 * 将用户的所有未读文件标记为已读
	 * 
	 * @param userId 用户id
	 * @param sortId 分类id
	 * @return true 表示成功， false表示失败
	 */
	public boolean markAllAsReadForUser(String userId, String sortId);
	
	/**
	 * 批量标记文件已读
	 * @param userId
	 * @param filePks
	 * @param read
	 * @return
	 */
	public boolean markSelectedFilesAsRead(String userId, String[] filePks,
			Boolean read);
	
	/**
	 * 上报文件
	 * @param filePks
	 * @param reportStatus
	 * @return
	 */
	public void reportSelectedFiles(String[] filePks, Integer reportStatus, Boolean transfer);

	/**
	 * 获得“发布到用户”时的用户选择列表，此方法的参数由于在MainServlet里处理时，分页有问题，不再使用
	 * 已被getPublishUserInDept方法取代
	 * @param fileId  当前要发布的文件ID
	 * @param deptId  选择的部门ID
	 * @deprecated
	 * @return
	 */
	public List getPublishUser(String fileId, String deptId);
	/**
	 * 获得“发布到用户”时的用户选择列表
	 * @return
	 */
	List getPublishUserInDept(String orderBy, Integer start,
			Integer limit, HashMap<String, String> params) ;
	/**
	 * 文件发布到用户，若已发布到该用户部门的文件不重复发布
	 * @param publishUserId 发布人id
	 * @param publishDeptId 发布人的部门id
	 * @param uidArr 发布的文件id数组
	 * @param userIdArrStr 发布到的用户id数组
	 * @param doExchange 是否进行数据交互
	 * @return
	 */
	public String filesPublishToUser(String publishUserId,
			String publishDeptId, String[] uidArr, String userIdArrStr, Boolean doExchange);

	/**
	 * 多个文件批量发布到部门，同时删除已发布到该部门的用户发布记录
	 * @param publishUserId 发布人id
	 * @param publishDeptId 发布人的部门id
	 * @param fileIds 发布的文件id数组
	 * @param deptIds 发布到的部门id数组
	 * @param doExchange 是否进行数据交互
	 * @return
	 */
	public String filesPublishToDept(String publishUserId,
			String publishDeptId, String[] fileIds, String deptIds, Boolean doExchange);

	/**
	 * 删除没有保存的文件上传的附件
	 * 
	 * @param fileUids 文件主ID
	 */
	public void deleteUnsavedFileAttatchment( String fileUids );
	
	/**
	 * 获取文件移交资料室的grid 的数据
	 * 
	 * @param fileId
	 * @param fileTypes
	 * @param yjrId
	 * @return
	 */
	public String getJsonStrForTransToZLS(String fileId, String fileTypes,
			String yjrId);

	/**
	 * 文件移交资料室
	 * 
	 * @param fileMap
	 * @param fileId
	 * @param zlSortId
	 * @param userId
	 * @return
	 */
	public boolean transToZLS(String fileLshs, String fileNames, String fileId,
			String zlSortId, String userId);

	/**
	 * 取消移交
	 * @param fileLsh
	 * @return
	 */
	public boolean cancelTrans(String fileLsh);
	/**
	 * 获取文件的附件数量
	 * 
	 * @param fileUids 文件uids
	 * @param includeMainDoc 是否包含主文档的附件数量
	 * @return 附件数量
	 */
	Integer getFileAttachCount(String fileUids, Boolean includeMainDoc);
	
	public abstract String syncBuilding3GroupUnitNewTree(Map paramsmap);
	/**
	 * 获取符合查询条件的所有已读或未读文档信息
	 * 
	 * @param sortIds
	 *            分类节点ID，多个用CAFConsatan.SPLITB进行分割
	 * @param showType
	 *            数据格式 是否显示自分类数据-是否显示无权限访问的数据 1-1：显示该分类及他所有子分类下所有的文档；
	 *            1-0：显示该分类及他所有自分类下的且该用户具备访问权限的所有文档；
	 * @param whereStr过滤条件
	 * @param stateSelected过滤条件
	 * @param userId过滤条件
	 * @return
	 */
	public List<ComFileInfo> getComFileoReadOrNotInfoBySortId(String sortIds,String stateSelected
			,String userId,String whereStr, String orderby, Integer start, Integer limit);
	
	/**
	 * 获取未读消息数量,发布与上报之和
	 * @param pid项目单位
	 * @param userId
	 * @param deptId
	 *@param rootIdPublish项目单位模块根节点
	 *@param rootIdUpload项目单位模块根节点
	 * @return
	 */
	public Integer getUnreadMsgNumTotal(String pid,String userId, String deptId,String rootIdPublish,String rootIdUpload);	
	
	/**
	 * 将用户上报的所有未读文件标记为已读
	 * 
	 * @param userId 用户id
	 * @param sortId 文件分类ID
	 * @param pid 项目单位ID
	 * @return true 表示成功， false表示失败
	 */
	public boolean markAllAsReadForUserUpload(String userId, String sortId,String pid);	
	
	/**
	 * 获取未读消息数量,发布到当前节点的
	 * @param userId
	 * @param deptId
	* @param rootId项目单位模块根节点
	 * @return
	 */
	public Integer getUnreadMsgNumPublish(String userId, String deptId,String rootId);
	
	/**
	 * 获取未读消息数量,上报到当前节点的
	 * @param userId
	 * @param deptId
	* @param rootId项目单位模块根节点
	 * @return
	 */		
	public Integer getUnreadMsgNumUpload(String userId, String deptId,String rootId);	
	/**
	 * 根据模块名称，用户主键获取模块的URL
	 * @param moduleName模块名称
	 * @param userId
	 * @return
	 */
	public String getModuleUrlByUserId(String moduleName,String userId);
	/**
	 * 根据集团删除分类模块时，下发分类的项目单位也对应删除
	 * @param fileArr模块流水号 
	 * @param unitId项目单位编号 
	 * @param businessType模块类型
	 * @param blobTable大对象表名称
	 * @param beanName模板主表名称
	 * @return
	 */
	public String deleteFileByUnitId(String fileArr[],String unitId[],String businessType,String blobTable,String beanName);
	/**
	 * 获取招投标模块文件移交资料室的grid 的数据
	 * @param type
	 * @param fileId
	 * @param fileTypes
	 * @param yjrId
	 * @return
	 */
	public String getJsonStrForTransToZLSByType(String type,String fileId, String fileTypes,
			String yjrId);	
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
			String zlSortId, String userId);	
	/**
	 * 批量回收
	 * 
	 * @param filePks
	 * @return 
	 */
	public boolean recycleSelectedFiles(String[] filePks);	

	/**
	 * 获取符合查询条件的所有整改通知单
	 * 
	 * @param sortIds
	 *            分类节点ID，多个用CAFConsatan.SPLITB进行分割
	 * @param showType
	 *            数据格式 是否显示自分类数据-是否显示无权限访问的数据 1-1：显示该分类及他所有子分类下所有的文档；
	 *            1-0：显示该分类及他所有自分类下的且该用户具备访问权限的所有文档；
	 * @param deptIds
	 *            其他辅助过滤条件
	 * @return
	 */
	public List<ReformNoticeInfoView> getReformNoticeBySortId(String sortIds, String whereStr, String orderby, Integer start, Integer limit);

	/**
	 * 保存
	 * @param refFileInfo	整改通知单对象
	 * @param inputStream	文件输入流
	 * @return
	 */
	public String saveNewReformNotice(ReformNoticeInfo refFileInfo);

	/**
	 * 批量删除整改通知单及文件
	 * @param filePk	整改通知单主键数组
	 * @return
	 */
	public boolean deleteReformNotices(String[] filePks);

	/**
	 * 获取整改通知单文件的附件数量
	 * @param fileUids 文件uids
	 * @return 附件数量
	 */
	public Integer getReformFileAttachCount(String fileUids);

	/**
	 * 上报、审批
	 * @param uids	RrformNoticInfo主键
	 * @param reportState 要改变的状态
	 * @return
	 */
	public boolean reportReformNotices(String[] uids, String reportState);

	/**
	 * 获取所有已审批的通知单的发布信息
	 * @param dateSelected
	 * @param stateSelected
	 * @param userId
	 * @param deptId
	 * @param whereStr
	 * @param orderBy
	 * @return
	 */
	public List<ComFilePublishHistory> getReformNoticeListByPublish(
			String dateSelected, String stateSelected, String userId, String whereStr,
			String keyword, String orderBy, Integer start, Integer limit);

	/**
	 * 向部门发送短信
	 * @param userName	发送人ID
	 * @param userDept	发送人部门
	 * @param toDeptIds	发送到部门
	 * @param uids		短信内容对应数据的主键
	 * @return
	 */
	String sendSmsToDept(String userName, String userDept, String toDeptIds, String uids);

	/**
	 * 向用户发送短信
	 * @param userName	发送人ID
	 * @param userDept	发送人部门
	 * @param toUsers	发送到用户
	 * @param uids		短信内容对应数据的主键
	 * @return	true 成功，false 失败
	 */
	public String sendSmsToUser(String userName, String userDept, String toUsers, String uids);
	/**
	 * 根据模块id，用户主键获取模块的URL
	 * @param moduleName模块名称
	 * @param userId
	 * @return
	 */
	public String getModuleUrlByUserModouleId(String powerPk,String userId);
}
