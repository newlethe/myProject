package com.sgepit.pmis.equipment.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.apache.commons.fileupload.FileItem;
import org.apache.poi.ss.usermodel.Workbook;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.helps.dbService.exception.DbPropertyException;
import com.sgepit.helps.webdynproService.export.ExcelPortException;
import com.sgepit.pmis.equipment.hbm.EquCont;
import com.sgepit.pmis.equipment.hbm.EquGoodsArrival;
import com.sgepit.pmis.equipment.hbm.EquGoodsArrivalSub;
import com.sgepit.pmis.equipment.hbm.EquGoodsOpenbox;
import com.sgepit.pmis.equipment.hbm.EquGoodsOpenboxExce;
import com.sgepit.pmis.equipment.hbm.EquGoodsOpenboxExceView;
import com.sgepit.pmis.equipment.hbm.EquGoodsOpenboxNotice;
import com.sgepit.pmis.equipment.hbm.EquGoodsOpenboxSubPart;
import com.sgepit.pmis.equipment.hbm.EquGoodsOutEstimate;
import com.sgepit.pmis.equipment.hbm.EquGoodsStockOut;
import com.sgepit.pmis.equipment.hbm.EquGoodsStoreTk;
import com.sgepit.pmis.equipment.hbm.EquGoodsStorein;
import com.sgepit.pmis.equipment.hbm.EquGoodsStoreinEstimate;
import com.sgepit.pmis.equipment.hbm.EquGoodsUrgeView;
import com.sgepit.pmis.equipment.hbm.EquSpecialToolsDetail;

public interface EquMgmFacade {
	
	List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params) throws BusinessException;
	
	public List<TreeNode> buildTree(String treeName, String parentId, Map params);
	
	
	//yanglh
	
	/**
	 * @保存
	 * @param EquGoodsStorein ,pid,uids
	 */
     public String saveOrUpdataEquRkGoodsStorein(EquGoodsStorein equGoodsStorein,String pid,String uids,String flags);
     /**
      * @param uids：设备开箱主表主键
      * @param pid
      * @param getUids：设备入库主键
      * @param openBoxNo:选择后保存设备开箱检验单
      * @return "success"
      * 从设备开箱明细表中获取相关数据保存到设备入库明细表中
      */
     public String SetListEquRkGoodsStorein(String uids,String pid,String getUids,String openBoxNo);
     /**
      * @param uids
      * @param pid
      * @return  0--完结；1--未完结，2--有数据未填写完整。
      */
     public int judgmentFinished(String uids,String exceFlag, String pid,String judgment,String makeType);
     /**
      * @param uids
      * @param pid
      * @做入库是否完结做判断删除主表和字表的相关内容
      */
     public String  delEquRkGoodsStorein(String uids,String flag,String pid);

     /**
      * @param uids
      * @param AbnormalUids
      * @param pid
      * @根据选择的异常设备对入库详细信息进行新增
      */
     public String addAbnormalList(EquGoodsOpenboxExceView[] obj, String uids,String pid);
	 /**
	  * @param uids
	  * @param pid
	  * @对完结的入库单中明细表中的数据进入库存
	  */
     public String finishEquRkGoodsStorein(String uids, String pid,String judgment,String makeType);
     /**
      * @param uids设备入库详细信息主键
      * @param pid
      * @根据设备入库详细信息主键找到异常设备然后在删除时更该异常设备的是否存库字段
      */
     public String checkExceBox(String uids,String pid);

	//qiupy

     /**
 	 * 出库单完结操作
 	 */
	public String equOutFinished(String uids);

	/**
	 * @Title: addOrUpdateEquOut
	 * @Description: 更新设备出库主表信息
	 * @param @param equOut 出库但基本信息类
	 * @return String 返回类型
	 * @throws
	 * @author qiupy 2012-7-16 下午04:42:24
	 */
 	public String addOrUpdateEquOut(EquGoodsStockOut equOut);

	/**
	 * @Title: insertOutSubFromStock
	 * @Description: 从库存中选择设备到出库单明细
	 * @param @param uids
	 * @param @param id
	 * @param @param no
	 * @return String    返回类型
	 * @throws
	 * @author qiupy 2012-7-16 下午04:43:34
	 */
	public String insertOutSubFromStock(String[] uids, String id,String no,String flag);

	/**
	 * @Title: getStockNumFromStock
	 * @Description: 从库存中获取设备的库存数量
	 * @param @param id
	 * @param @return 设定文件
	 * @return String 返回类型
	 * @throws
	 * @author qiupy 2012-7-16 下午04:44:07
	 */
	public double getStockNumFromStock(String id);

	/**
	 * @Title: deleteOutAndOutSub
	 * @Description: 删除出库单信息，同时删除出库单详细信息，并且更新库存数量
	 * @param @param uids 设备出库单主键
	 * @return String 返回类型
	 * @throws
	 * @author qiupy 2012-7-16 下午04:45:39
	 */
 	public String deleteOutAndOutSub(String uids,String flag);

	/**
	 * @Title: getOutNumFromOutSub
	 * @Description: 获取设备出库数量
	 * @param @param id
	 * @return Long 返回类型
	 * @throws
	 * @author qiupy 2012-7-16 下午04:45:55
	 */
 	public Long getOutNumFromOutSub(String id);

	/**
	 * @Title: addOrUpdateEquTk
	 * @Description: 更新退库单基本信息
	 * @param @param equTk
	 * @param @return
	 * @return String
	 * @throws
	 * @author qiupy 2012-7-20
	 */
	public String addOrUpdateEquTk(EquGoodsStoreTk equTk);

	/**
	 * @Title: insertTkSubFromOutSub
	 * @Description: 从出库单明细中选择设备到退库单明细
	 * @param @param uids 出库单中选择设备的主键
	 * @param @param id 退库单主键
	 * @param @param no 退库单据号
	 * @param @param outId 出库单主键
	 * @param @param outNo 出库单据号
	 * @param @return
	 * @return String
	 * @throws
	 * @author qiupy 2012-7-20
	 */
	public String insertTkSubFromOutSub(String[] uids, String id, String no, String outId, String outNo);

	/**
	 * 删除退库单以及退库单详细信息
	 * @Title: deleteTkAndTkSub
	 * @Description:
	 * @param @param uids
	 * @param @return
	 * @return String
	 * @throws
	 * @author qiupy 2012-7-20
	 */
 	public String deleteTkAndTkSub(String uids);

	/**
	 * 退库完结操作 完结时要更新库存设备数量
	 * @Title: equTkFinished
	 * @Description:
	 * @param @param uids
	 * @param @return
	 * @return String
	 * @throws
	 * @author qiupy 2012-7-20
	 */
 	public String equTkFinished(String uids);

	/**
	 * 删除退库明细单中的设备信息
	 * @Title: deleteTkSub
	 * @Description:
	 * @param @param uids
	 * @param @param tkid
	 * @param @return
	 * @return String
	 * @throws
	 * @author qiupy 2012-7-20
	 */
 	public String deleteTkSub(String[] uids, String tkid);
	//zhangh


	/**
	 * 更新设备合同信息
	 * @param equCont
	 * @return
	 * @author zhangh 2012-06-27
	 */
	public String addOrUpdateEquCont(EquCont equCont);

	/**
	 * 更新设备到货主表信息
	 * @param arrival
	 * @return
	 * @author zhangh 2012-06-28
	 */
	public String addOrUpdateEquArrival(EquGoodsArrival arrival);
	
	/**
	 * 判断到货单是否已经开箱。
	 * @param uids
	 * @return
	 * @author zhangh 2012-06-29
	 */
	public Boolean equArrivalIsBoxOpen(String uids);
	
	/**
	 * 到货单完结操作
	 * @param uids
	 * @return
	 * @author zhangh 2012-06-29
	 */
	public String equArrivalFinished(String uids);
	
	/**
	 * 获取到货批号，其他设备模块的批号可通用
	 * @param pid : PID
	 * @param prefix : 编号前缀
	 * @param col : 列名称
	 * @param table : 表名称
	 * @param lsh ：最大的流水号（可手动传入。null，表示没有传入，需要从数据库中获取）
	 * @return
	 * @author zhangh 2012-06-29
	 */
	public String getEquNewDhNo(String pid, String prefix, String col, String table,Long lsh);

	/**
	 * 更新设备开箱检验通知单主表信息
	 * @param notice
	 * @return
	 * @author zhangh 2012-07-02
	 */
	public String addOrUpdateEquOpenboxNotice(EquGoodsOpenboxNotice notice);
	
	/**
	 * 从到货单明细中选择设备到开箱通知单明细
	 * @param uids	已选择的明细主键
	 * @param id	开箱通知单主键
	 * @param no	开箱通知单批次号
	 * @author zhangh 2012-07-03
	 * @return
	 */
	public String insertNoticeSubFromArrivalSub(String[] uids,String id,String no);
	
	/**
	 * 检验通知单完结操作
	 * @param uids
	 * @return 1：完结操作成功，2：已检验，不能完结操作。
	 * @author zhangh 2012-07-03
	 */
	public String equNoticeFinished(String uids);
	
	/**
	 * 更新设备开箱检验单主表信息
	 * @param notice
	 * @return
	 * @author zhangh 2012-07-04
	 */
	public String addOrUpdateEquOpenbox(EquGoodsOpenbox openbox);
	
	/**
	 * 根据开箱检验单主键删除从表数据
	 * @param openboxId
	 * @author zhangh 2012-07-04
	 */
	public void deleteEquOpenboxSub(String openboxUids);
	
	/**
	 * 检验单中选择到货单，同步将通知单中设备存入检验单，检验单中设备基本属性与到货单中属性相同
	 * @param openboxUids
	 * @param noticeUids
	 * @return
	 * @author zhangh 2012-07-04
	 */
	public String getOpenboxSubFromNotice(String openboxUids, String noticeUids);
	
	/**
	 * 初始化开箱检验结果
	 * @param openboxUids
	 * @return
	 * @author zhangh 2012-07-05
	 */
	public String initEquOpenboxResult(String openboxUids);
	
	/**
	 * 开箱检验单完结操作
	 * @param uids
	 * @return 1：完结操作成功，2：已入库，不能完结操作，3：检验结果数据不完整，不能完结操作。
	 * @author zhangh 2012-07-05
	 */
	public String equOpenboxFinished(String uids);
	
	
	/**
	 * 保存异常处理结果
	 * @param exceArr
	 * @return
	 * @author zhangh 2012-07-06
	 */
	public String saveEquOpenboxException(EquGoodsOpenboxExce[] exceArr);
	
	
	/**
	 * 异常处理结果完结操作
	 * @param uids
	 * @return 1：完结操作成功，2：已入库，不能完结操作
	 * @author zhangh 2012-07-06
	 */
	public String equOpenboxExceFinished(String uids);
	
	/**
	 * 删除到货单
	 * @param uids
	 * @return
	 * @author zhangh 2012-07-13
	 */
	public String deleteArrival(String uids);
	
	/**
	 * 删除开箱通知单
	 * @param uids
	 * @return
	 * @author zhangh 2012-07-13
	 */
	public String deleteOpenboxNotice(String uids);
	
	/**
	 * 删除开箱检验单
	 * @param uids
	 * @return
	 * @author zhangh 2012-07-13
	 */
	public String deleteOpenbox(String uids);
	
	/**
	 * 保存提醒时间和范围
	 * @param views
	 * @return
	 * @author zhangh 2012-07-16
	 */
	public String saveUrge(EquGoodsUrgeView[] views);
	
	/**
	 * 催交完结操作
	 * @param uids
	 * @return 1：完结操作成功
	 * @author zhangh 2012-07-16
	 */
	public String equEquJzDateFinished(String uids);
	
	/**
	 * 设置提醒范围
	 * @param uids 催交主表（EQU_JZ_DATE）主键
	 * @param type unit：按单位选择，user：按用户选择，group：按分组选择
	 * @param idArr 选中的类型的主键
	 * @param pid
	 * @return
	 * @author zhangh 2012-07-17
	 */
	public String setRemindRange(String uids, String type, String[] idArr, String pid);
	
	/**
	 * 保存分组
	 * @param groupname
	 * @param pid
	 * @param jzDateUids
	 * @param userArr
	 * @return
	 * @author zhangh 2012-07-17
	 */
	public String saveGroup(String groupname,String pid,String jzDateUids,String[] userArr);
	
	/**
	 * 删除分组
	 * @param uids
	 * @return
	 */
	public String deleteEquUrgeGroup(String[] uidsArr);
	
	/**
	 * 设备催交提醒短信发送
	 * @author zhangh 2012-07-18
	 */
	public void sendSmsByEquUrgeRemind();
	
	
	/**
	 * 粘贴开箱管理中的部件录入明细
	 * @param parts
	 * @return
	 * @author zhangh 2012-09-06
	 */
	public String pasteEquOpenboxPart(EquGoodsOpenboxSubPart[] parts);
	
	/**
	 * 根据业务类型，获取最新的数据导出Excel报表模板信息；
	 * @param businessType
	 * @return
	 */
	public InputStream getExcelTemplate(String businessType);
	/**
	 * 设备附件移交
	 * @param type
	 * @param fileId
	 * @param fileTypes
	 * @param yjrName
	 * @return
	 * @author yanglh 2012-12-03
	 */
	public String getJsonStrForTransToZLSByType(String type,String fileId,String fileTypes,String yjrName,String conid);
	/**
	 * 设备开箱检验单附件移交
	 * @param pid
	 * @param userdeptid
	 * @param username
	 * @param type
	 * @param fileLshs
	 * @param fileNames
	 * @param fileIds
	 * @param zlSortId
	 * @param flag
	 * @author yanglh 2012-12-03
	 */
	public boolean equTransToZLSByType(String pid, String userdeptid,
									String username, String type, String fileLshs, String fileNames,
									String fileIds, String zlSortId,boolean flag);
	/**
	 * 设备开箱检验结果附件移交撤回
	 * @param filelsh
	 * @param fileIds
	 * @author yanglh 2012-12-05
	 */
	public boolean cancelEquTrans(String filelsh,String fileIds,String zlTitle);
	/**
	 * 专用工具借用管理细表
	 * @param EquSpecialToolsDetail
	 * @author shangtw 2013-4-11
	 */
	public String initEquSpecialToolsDetail(EquSpecialToolsDetail equSpecialToolsDetail);	
	
	/**
	 * 根据专用工具主表id删除专用工具细表
	 * @param masteruids
	 * @author shangtw 2013-4-12
	 */
	public String deleteEquSpecialToolsDetailByMaster(String masteruids);		
	
	
	/**
	 * 粘贴设备到货中的到货单明细
	 * @param parts
	 * 				从页面传回的到货单明细数组对象
	 * @return	'1'	添加成功
	 * @author pengy 2013-05-03
	 */
	public String pasteEquArrivalSubPart(EquGoodsArrivalSub[] parts);
	
	/**
	 * 通过选择的设备合同树子节点，查找其所属的三级节点，即01主设备,02备用备品,03专用工具
	 * @param treeid	选择的设备合同树的treeid
	 * @param conid		合同id
	 * @return		三级节点的设备类型1,2,3	
	 */
	public String findEquType(String treeid,String conid);
	
	/**
	 * 物资模块从表excel导入
	 * @param pid
	 * @param uids
	 * @param beanName
	 * @param fileItem
	 * @return
	 * @author zhengh 2013-05-21
	 */
	public String importData(String pid,String uids,String beanName,FileItem fileItem);
	
	/**
	 *	主体设备清册导入
	 * @param pid
	 * @param uids
	 * @param beanName
	 * @param fileItem
	 * @return
	 * @author zhengh 2013-05-21
	 */
	public String importBodyData(String pid, String selectUuid,String selectConid,String userDept,String bean,FileItem fileItem);
	
	//从津能移植主体设备维护到国锦相关方法
    /**
     * @param uids
     * @param pid
     * 暂估入库是否完结做判断删除主表和字表的相关内容
     */
	public String delEquRkGoodsStoreinEstimate(String uids, String flag,
			String pid);
    /**
     * 暂估入库单完结
     * @param uids
     * @param exceFlag
     * @param pid
     * @author yanglh 2012-12-26
     */
	public int judgmentFinishedEstimate(String uids, String exceFlag, String pid,String judement,String makeType);
	  /**
     * 确认冲回入库按钮操作功能实现
     * @param uids
     * @param newNo
     * @return
     */
    public  String resetGoodsStoreinBack(String uids,String newNo,String userDeptid,String userId);
    /**
	 * 删除冲回入库数据
	 * 
	 * @param uids
	 * @param flag
	 * @param pid
	 * @return
	 */
	public String delEquRkGoodsStoreinBack(String uids, String flag, String pid);
	/**
	 * 冲回入库完结操作
	 * 
	 * @param uids
	 * @param exceFlag
	 * @param pid
	 * @return
	 */
	public int judgmentBackFinished(String uids, String exceFlag, String pid,String judgment,String makeType);
	
	/**
	 * 设备模块出库单单号的获取，其他模块按实际情况可用
	 * @param pid : PID
	 * @param prefix : 编号前缀
	 * @param col : 列名称
	 * @param table : 表名称
	 * @param lsh ：最大的流水号（可手动传入。null，表示没有传入，需要从数据库中获取）
	 * @return
	 * @author yanglh 2012-06-29
	 */
	public String getEquNewDhNoToSb(String pid, String prefix, String col, String table,Long lsh,String whereSql);
	/**
	 * 暂估入库新增时保存到主表的记录
	 * 
	 * @param equGoodsZGRKStorein
	 * @param pid
	 * @param uids
	 * @return
	 */
	public String saveOrUpdataEquZGRkGoodsStorein(
			EquGoodsStoreinEstimate equGoodsZGRKStorein, String pid, String uids);
	/**
	 * @author yanglh
	 * @date 2013年04月23日
	 * @see 设备管理主体设备中暂估入库新增明细是从主体设备选择功能安装
	 * @param getUids
	 * @param sbrkUids
	 * @return
	 */
	public String getEsSubFromEquGoodsBody(String[] getUids, String sbrkUids);
	/**
	 * @author yanglh
	 * @date 2013年04月23日
	 * @see 设备管理主体设备中正式入库新增明细是从主体设备选择功能安装
	 * @param getUids
	 * @param sbrkUids
	 * @return
	 */
	public String getEquSubFromEquGoodsBody(String[] getUids, String sbrkUids, String warehouseType);
	/**
	 * 从暂估入库中选择
	 * 
	 * @param newNo
	 * @param uids
	 * @return
	 */
	public String equGoodsIntoWarehousingFromZGRK(String newNo, String uids,
			String pid);
	/**
	 * 更新设备暂估出库主表信息
	 * 
	 * @param equOut
	 * @return
	 */
	public String addOrUpdateEquOutEstimate(EquGoodsOutEstimate equOut);
	/**
	 * 从库存中选择设备到暂估出库单明细
	 * 
	 * @param uids
	 * @param id
	 * @param no
	 * @return
	 */
	public String insertEstimateOutSubFromStock(String[] uids, String id,
			String no);
	/**
 	 * @param uids
 	 * @param id
 	 * @param no
 	 * @return
 	 */
	public String insertOutEsSubFromStock(String[] uids, String id, String no);
	/**
	 * 暂估出库删除
	 * 
	 * @param uids
	 * @return
	 */
	public String deleteEstimateOutAndOutSub(String uids);
	/**
	 * 冲回入库进行选择后把暂估入库的数据保存到冲回入库表中
	 * 
	 * @param uids
	 * @return
	 */
	public String insertEquGoodsOutBack(String uids, String newCkNo);
	/**
  	 * 冲回出库删除
  	 * @param uids
  	 * @return
  	 */
	public String deleteOutBackAndOutBackSub(String uids);
	/**
	 * 暂估出库单完结
	 * 
	 * @param uids
	 * @return
	 */
	public String equOutEstimateFinished(String uids);
	/**
	 * 冲回出库完结操作
	 * @param uids
	 * @return
	 */
	public String equOutBackFinished(String uids);

	/**
	 * 单据保存文档（设备入库单，出库单）
	 * @param fileid
	 * @param uids
	 * @param beanName
	 * @return
	 * @author zhangh 2012-09-28
	 */
	public String saveFile(String fileid, String uids, String beanName);

	/**
	 * shuz
	 * 设备模块出库单单号的获取，其他模块按实际情况可用,bug修改
	 * @param pid : PID
	 * @param prefix : 编号前缀
	 * @param col : 列名称
	 * @param table : 表名称
	 * @param lsh ：最大的流水号（可手动传入。null，表示没有传入，需要从数据库中获取）
	 * @return
	 * @author yanglh 2014-03-04
	 */
	public String getEquNewDhNoToSbJn(String pid, String prefix, String col,
			String table, Long lsh,String whereSql,int length);

	/**
	 * 暂估入库冲回
	 * @param uids,EquGoodsStorein
	 * @return “success” 成功，“failure” 失败
	 * @author yanlgh 2013-11-14
	 */
	public String zgrkInsertChrkAndZsrk(String uids,EquGoodsStorein equ);
	
	/**
	 * 暂估出库冲回
	 * @param uids
	 * @param EquGoodsStockOut equ
	 * @return  “success” 成功，“failure” 失败
	 * @author yanlgh 2013-11-14
	 */
	public String zgckInsertChckAndZsck(String uids,EquGoodsStockOut equ);

	/**
	 * 主体设备记录完结时的入库主从表信息做台账
	 * yanglh	2013-8-9
	 * @param pid
	 * @param mainTable
	 * @param fromTableUids 从表主键
	 * @param fromTableSubNum 从表填写时的数量
	 * @param inOrOut:RK--记录入库信息，CK--记录出库信息
	 */
	public void insertSubToFinishedRecord(String pid, String mainTableUids,String fromTableUids,String fromTableSubNum,String inOrOut);

	/**
	 * 
	 * @Title: updateStockNum
	 * @Description: 修改库存数量
	 * @param @param newstocknum
	 * @param @param id
	 * @param @param amount 出库金额
	 * @return int    返回类型
	 * @throws
	 * @author qiupy 2012-7-16 下午04:44:57
	 */
	public int updateStockNum(Double newstocknum,String id, Double amount);

	/**
	 * 出库中删除未完结的已经保存到台账的数据
	 * @param mainUids
	 * @param fromTableUids
	 */
	public void delEquGoodsFinishedRecord(String mainUids);

	/**
	 * 重构getEquNewDhNo方法
	 * @param pid
	 * @param prefix
	 * @param col
	 * @param table
	 * @param lsh
	 * @param whereSql
	 * @return
	 */
	public String getEquNewDhNoToSbCG(String pid, String prefix, String col,
			String table, Long lsh,String whereSql);

	/**
	 * 初始化物质台帐
	 * @param selectTreeId 物资台帐类型
	 * @param pid 
	 * @author zhangh 2013-8-10
	 */
	public void initEquWzTz(String selectTreeId, String pid);

	/**
	 * 查询物资台账，按照物资、时间的双重排序
	 * @param beanName	实体类名
	 * @param where		查询调教
	 * @param orderBy	排序条件：物资编码
	 * @param firstRow	起始行
	 * @param maxRow	查询条数
	 * @return	查询数据集合加总记录数
	 * @author pengy 2013-09-10
	 */	
	public List findWzOrderBy(String beanName, String where, String orderBy, Integer firstRow, Integer maxRow);

	/**
	 * 初始化未完结物资台帐
	 * @param selectTreeId 物资台帐类型
	 * @param pid 
	 * @author pengy 2013-09-22
	 */
	public String initEquUnfinishWzTz(String selectTreeId, String pid);

	/**
	 * 向物资台账模板写入数据
	 * @param map1	查询条件
	 * @param wb	工作簿
	 * @return Excel输出流
	 * @author pengy 2013-09-23
	 */
	public ByteArrayOutputStream fillDataToEquGoodsTzExcel(Workbook wb, Map<String, String> map1) throws DbPropertyException, SQLException, IOException, ExcelPortException;

	/**
	 * 物资台账统计值
	 * @param where 查询条件
	 * @return	统计对象及数量1
	 */
	public List equGoodsTzStatistic(String where);

	/**
	 * 导出月度统计台账
	 * @param map1	查询条件
	 * @param wb	工作簿
	 * @return Excel输出流
	 * @author pengy 2014-08-27
	 */
	public ByteArrayOutputStream fillDataToMonthTotalTzExcel(Workbook wb, Map<String, String> map1) throws DbPropertyException, SQLException, IOException, ExcelPortException;

}