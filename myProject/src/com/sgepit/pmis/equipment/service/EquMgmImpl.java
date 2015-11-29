package com.sgepit.pmis.equipment.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.UUID;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.http.HttpSession;
import javax.sql.DataSource;

import oracle.sql.BLOB;

import org.apache.commons.fileupload.FileItem;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.RichTextString;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.flow.hbm.ZlInfo;
import com.sgepit.frame.sysman.dao.PropertyCodeDAO;
import com.sgepit.frame.sysman.hbm.RockUser;
import com.sgepit.frame.sysman.hbm.SgccAttachBlob;
import com.sgepit.frame.sysman.hbm.SgccAttachList;
import com.sgepit.frame.util.JNDIUtil;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.StringUtil;
import com.sgepit.frame.util.sms.service.SendMessageFacade;
import com.sgepit.helps.dbService.DbCon;
import com.sgepit.helps.dbService.exception.DbPropertyException;
import com.sgepit.helps.dbService.sqlHelp.BuildSql;
import com.sgepit.helps.excelService.ColumnControlBean;
import com.sgepit.helps.excelService.SheetControlBean;
import com.sgepit.helps.excelService.XMLToExcel;
import com.sgepit.helps.webdynproService.export.ExcelPortException;
import com.sgepit.pmis.contract.hbm.ConOve;
import com.sgepit.pmis.contract.hbm.ConPartyb;
import com.sgepit.pmis.document.hbm.ZlInfoBlobList;
import com.sgepit.pmis.document.hbm.ZlTree;
import com.sgepit.pmis.equipment.dao.EquipmentDAO;
import com.sgepit.pmis.equipment.hbm.EquCont;
import com.sgepit.pmis.equipment.hbm.EquContView;
import com.sgepit.pmis.equipment.hbm.EquFile;
import com.sgepit.pmis.equipment.hbm.EquGoodsArrival;
import com.sgepit.pmis.equipment.hbm.EquGoodsArrivalSub;
import com.sgepit.pmis.equipment.hbm.EquGoodsBodys;
import com.sgepit.pmis.equipment.hbm.EquGoodsFinishedRecord;
import com.sgepit.pmis.equipment.hbm.EquGoodsOpenbox;
import com.sgepit.pmis.equipment.hbm.EquGoodsOpenboxExce;
import com.sgepit.pmis.equipment.hbm.EquGoodsOpenboxExceView;
import com.sgepit.pmis.equipment.hbm.EquGoodsOpenboxNotice;
import com.sgepit.pmis.equipment.hbm.EquGoodsOpenboxNoticeSub;
import com.sgepit.pmis.equipment.hbm.EquGoodsOpenboxResult;
import com.sgepit.pmis.equipment.hbm.EquGoodsOpenboxSub;
import com.sgepit.pmis.equipment.hbm.EquGoodsOpenboxSubPart;
import com.sgepit.pmis.equipment.hbm.EquGoodsOutBack;
import com.sgepit.pmis.equipment.hbm.EquGoodsOutBackSub;
import com.sgepit.pmis.equipment.hbm.EquGoodsOutEstimate;
import com.sgepit.pmis.equipment.hbm.EquGoodsOutEstimateSub;
import com.sgepit.pmis.equipment.hbm.EquGoodsStock;
import com.sgepit.pmis.equipment.hbm.EquGoodsStockOut;
import com.sgepit.pmis.equipment.hbm.EquGoodsStockOutSub;
import com.sgepit.pmis.equipment.hbm.EquGoodsStoreTk;
import com.sgepit.pmis.equipment.hbm.EquGoodsStoreTkSub;
import com.sgepit.pmis.equipment.hbm.EquGoodsStorein;
import com.sgepit.pmis.equipment.hbm.EquGoodsStoreinBack;
import com.sgepit.pmis.equipment.hbm.EquGoodsStoreinBackSub;
import com.sgepit.pmis.equipment.hbm.EquGoodsStoreinEstimate;
import com.sgepit.pmis.equipment.hbm.EquGoodsStoreinEstimateSub;
import com.sgepit.pmis.equipment.hbm.EquGoodsStoreinSub;
import com.sgepit.pmis.equipment.hbm.EquGoodsTz;
import com.sgepit.pmis.equipment.hbm.EquGoodsTzMonthTotal;
import com.sgepit.pmis.equipment.hbm.EquGoodsUrgeGroup;
import com.sgepit.pmis.equipment.hbm.EquGoodsUrgeGroupUser;
import com.sgepit.pmis.equipment.hbm.EquGoodsUrgeRemind;
import com.sgepit.pmis.equipment.hbm.EquGoodsUrgeView;
import com.sgepit.pmis.equipment.hbm.EquJzDate;
import com.sgepit.pmis.equipment.hbm.EquSpecialToolsDetail;
import com.sgepit.pmis.equipment.hbm.EquTypeTree;
import com.sgepit.pmis.equipment.hbm.EquWarehouse;

public class EquMgmImpl extends BaseMgmImpl implements EquMgmFacade {
	
	private EqulistMgmFacade equlistMgm;
	private EquSteupMgmFacade equSetupMgm;
	private EquBaseInfoFacade equBaseInfo;
	private EquipmentDAO equipmentDAO;
	
	public void setEqulistMgm(EqulistMgmFacade equlistMgm) {
		this.equlistMgm = equlistMgm;
	}
	
	public EqulistMgmFacade getEqulistMgm() {
		return equlistMgm;
	}

	public EquSteupMgmFacade getEquSetupMgm() {
		return equSetupMgm;
	}

	public void setEquSetupMgm(EquSteupMgmFacade equSetupMgm) {
		this.equSetupMgm = equSetupMgm;
	}

	public EquBaseInfoFacade getEquBaseInfo() {
		return equBaseInfo;
	}

	public void setEquBaseInfo(EquBaseInfoFacade equBaseInfo) {
		this.equBaseInfo = equBaseInfo;
	}

	public static EquMgmImpl getFromApplicationContext(ApplicationContext ctx) {
		return (EquMgmImpl) ctx.getBean("equMgm");
	}
	
	public EquipmentDAO getEquipmentDAO() {
		return equipmentDAO;
	}

	public void setEquipmentDAO(EquipmentDAO equipmentDAO) {
		this.equipmentDAO = equipmentDAO;
	}
	
	private SendMessageFacade sendMessage;
	
	public SendMessageFacade getSendMessage() {
		return sendMessage;
	}

	public void setSendMessage(SendMessageFacade sendMessage) {
		this.sendMessage = sendMessage;
	}

	// -------------------------------------------------------------------------
	// user methods 
	// -------------------------------------------------------------------------
	public List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params) throws BusinessException {
		
		EqulistMgmFacade equlistMgm = getEqulistMgm();
		
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		
		if (treeName.equalsIgnoreCase("equListTree")) {			
			list = equlistMgm.equlistTree(parentId);
		} 
		  
		if (treeName.equalsIgnoreCase("equListTreeQc")) {
			String whereStr = "";
			if (params!=null && params.size()>0) {
				String[] pid = (String[]) params.get("pid");
				if (pid!=null && pid.length>0) {
					whereStr += " and pid='" + pid[0] + "'";
				}
			}
			list = equlistMgm.equlistTreeQc(parentId, whereStr);
		}  
		if (treeName.equalsIgnoreCase("equTypeTree")) {
			String whereStr = "";
			String conid="";
			String initFlag="";
			if (params!=null && params.size()>0) {
				String[] pid = (String[]) params.get("pid");
				conid=((String[])params.get("conid"))[0];
				initFlag=((String[])params.get("initFlag"))[0];
				if (pid!=null && pid.length>0) {
					whereStr += " and pid='" + pid[0] + "'";
				}
			}
			list = equBaseInfo.equTypeTree(parentId, whereStr,conid,initFlag);
		}
		if (treeName.equalsIgnoreCase("equTypeTreeList")) {
			String whereStr = "";
			String conid="";
			if (params!=null && params.size()>0) {
				String[] pid = (String[]) params.get("pid");
				conid=((String[])params.get("conid"))[0];
				if (pid!=null && pid.length>0) {
					whereStr += " and pid='" + pid[0] + "'";
				}
			}
			list = equBaseInfo.equTypeTreeList(parentId, whereStr,conid);
		}
		if (treeName.equalsIgnoreCase("newEquTypeTreeList")) {
			String whereStr = "";
			String conid="";
			if (params!=null && params.size()>0) {
				String[] pid = (String[]) params.get("pid");
				conid=((String[])params.get("conid"))[0];
				if (pid!=null && pid.length>0) {
					whereStr = pid[0];
				}
			}
			list = equBaseInfo.newEquTypeTreeList(parentId, whereStr,conid);
		}
		if (treeName.equalsIgnoreCase("newEquTypeTreeListSingle")) {
			String whereStr = "";
			String conid="";
			if (params!=null && params.size()>0) {
				String[] pid = (String[]) params.get("pid");
				conid=((String[])params.get("conid"))[0];
				if (pid!=null && pid.length>0) {
					whereStr = pid[0];
				}
			}
			list = equBaseInfo.newEquTypeTreeListSingle(parentId, whereStr,conid);
		}		
		if (treeName.equalsIgnoreCase("getEqulistTree")) {	
			String dhId = ((String[])params.get("conid"))[0];
			String ggid = ((String[])params.get("ggid"))[0];
			list = equlistMgm.getEqulistTree(parentId, dhId,ggid);
		}
		if (treeName.equalsIgnoreCase("getEqulistTree2")) {	
			String kxuuid = ((String[])params.get("kxuuid"))[0];
			String kxsbid = ((String[])params.get("kxsbid"))[0];
			list = equlistMgm.getEqulistTree2(parentId,kxuuid,kxsbid);
		}
		
		return list;
	}

	public List<TreeNode> buildTree(String treeName, String parentId, Map params) throws BusinessException {
		List<TreeNode> list = new ArrayList<TreeNode>();
		if (treeName.equalsIgnoreCase("equlistTreeAuto")) {			
			list = equlistMgm.equlistTreeAuto(parentId, ((String[])params.get("sbHtFl1Id"))[0],((String[])params.get("parentType"))[0]);
		}
		if (treeName.equalsIgnoreCase("htAndOutTree")) {			
			list = equSetupMgm.htAndOutTree(parentId, ((String[])params.get("sbHtFl1Id"))[0],((String[])params.get("parentType"))[0]);
		}
		return list;
	}

	//yanglh
	/**
	 * @设备入库保存
	 * @param EquGoodsStorein,pid,uids
	 */
	public String saveOrUpdataEquRkGoodsStorein(EquGoodsStorein equGoodsStorein,String pid,String uids,String flags) {
		String warehouseNo = equGoodsStorein.getWarehouseNo();
		String conid = equGoodsStorein.getConid();
		uids = equGoodsStorein.getUids();
		String flag = "repeat";
		if("".equals(uids)){
			String whereSql = " pid='"+pid+"' and warehouseNo='"+warehouseNo+"' and conid='"+conid+"' and dataType='"+flags+"'";
			List list = this.equipmentDAO.findByWhere(EquGoodsStorein.class.getName(),whereSql);
			if(list.size()>0){
				flag = "repeat";
			}else {
				ConOve conOve = (ConOve) this.equipmentDAO.findById(ConOve.class.getName(), equGoodsStorein.getConid());
				equGoodsStorein.setSupplyunit(conOve.getPartybno());
				
				//获得供货单位id(供货单位来源于合同乙方单位cpid)
				String cpid = equGoodsStorein.getSupplyunit();
				ConPartyb mConPartyb = (ConPartyb) this.equipmentDAO.findById(ConPartyb.class.getName(), cpid);
				
				if(mConPartyb != null){
					
					//通过单位名称匹配属性代码,然后赋给 入库的参与单位
					String sqlWhere = "select c.* from PROPERTY_CODE c where c.TYPE_NAME =(select p.uids from Property_Type "
							+ "p where p.TYPE_NAME = '主体设备参与单位') and c.detail_type ='" + mConPartyb.getPartyb() + "'";
					List mList = this.equipmentDAO.getDataAutoCloseSes(sqlWhere);
					
					if(mList != null && mList.size()>0){
						String propertyCode = "";
						for(Iterator it=mList.iterator();it.hasNext();) {
							Object[] obj = (Object[]) it.next(); 
							propertyCode = (String) obj[1];
						}
						equGoodsStorein.setJoinUnit(propertyCode);
					}
					
				}
				
				this.equipmentDAO.insert(equGoodsStorein);
				return "success";
			}
		}else if(!"".equals(uids)){
			  this.equipmentDAO.saveOrUpdate(equGoodsStorein);
			  flag = "success";
		} else {
			flag = "failure";
		}
		return flag;
	}

    /**
     * @param uids：设备开箱主表主键
     * @param pid
     * @param getUids：设备入库主键
     * @param openBoxNo:设备开箱检验单
     * 从设备开箱明细表中获取相关数据保存到设备入库明细表中
     */
	@SuppressWarnings("rawtypes")
	public String SetListEquRkGoodsStorein(String uids, String pid, String getUids,String openBoxNo) {
		String updataSql = "update equ_goods_storein t set t.notice_no='"+openBoxNo +"',t.abnormal_or_no='0'," +
				"t.open_box_id='"+uids+"' where t.uids='"+getUids+"' and t.pid='"+pid+"'";
		uids = com.sgepit.frame.util.StringUtil.transStrToIn(uids, ",");
		String shereSql = " openbox_id in("+uids+") and pid='"+pid+"' order by uids";
		List delList = this.equipmentDAO.findByWhere(EquGoodsStoreinSub.class.getName(), "sbrk_uids='"+getUids+"' and  pid='"+pid+"'");
		if(delList.size()>0){
			List getStoreinUids = this.equipmentDAO.findByWhere(EquGoodsStorein.class.getName(), "uids='"+getUids+"' and pid='"+pid+"'");
			EquGoodsStorein equGoodsStorein = (EquGoodsStorein) getStoreinUids.get(0);
			String updataIsStorein = "update equ_goods_openbox set is_storein ='0' where uids='"+equGoodsStorein.getOpenBoxId()+"' and pid='"+pid+"'";
			this.equipmentDAO.updateBySQL(updataIsStorein);
			this.equipmentDAO.deleteAll(delList);
		}
		List list = this.equipmentDAO.findByWhere(EquGoodsOpenboxResult.class.getName(), shereSql);
		for(int i=0;i<list.size();i++){
			EquGoodsOpenboxResult obj = (EquGoodsOpenboxResult) list.get(i);
			EquGoodsStoreinSub equGoodsStoreinSub = new EquGoodsStoreinSub();
			equGoodsStoreinSub.setPid(pid);
			equGoodsStoreinSub.setSbrkUids(getUids);
			equGoodsStoreinSub.setBoxSubId(obj.getUids());
			equGoodsStoreinSub.setJzNo(obj.getJzNo());
			equGoodsStoreinSub.setBoxNo(obj.getBoxNo());
			equGoodsStoreinSub.setWarehouseName(obj.getEquPartName());
			equGoodsStoreinSub.setWarehouseType(obj.getEquType());
			equGoodsStoreinSub.setGgxh(obj.getGgxh());
			equGoodsStoreinSub.setWeight(obj.getWeight());
			equGoodsStoreinSub.setGraphNo(obj.getGraphNo());
			equGoodsStoreinSub.setUnit(obj.getUnit());
			equGoodsStoreinSub.setWarehouseNum(obj.getPassNum());
			equGoodsStoreinSub.setInWarehouseNo(obj.getPassNum());
			equGoodsStoreinSub.setEquno(obj.getStorage());
			equGoodsStoreinSub.setStockno(obj.getBoxNo());
			
			equGoodsStoreinSub.setTreeuids(obj.getTreeuids());
			this.equipmentDAO.insert(equGoodsStoreinSub);
		}
		String updataIsStorein = "update equ_goods_openbox set is_storein ='1' where uids in("+uids+") and pid='"+pid+"'";
		this.equipmentDAO.updateBySQL(updataIsStorein);
		this.equipmentDAO.updateBySQL(updataSql);
		return "success";
	}

	/**设备入库完结（finished = '1：已完结，0：未完结';）
	 * @param uids
	 * @param pid
	 * @return 1--已完结；0--未完结
	 */
	public int judgmentFinished(String uids,String exceFlag, String pid,String judgment,String makeType) {
		List list = this.equipmentDAO.findByWhere(EquGoodsStoreinSub.class.getName(), "sbrkUids='"+uids+"' and pid='"+pid+"'");
		if(list.size() == 0){
			return 3;
		}else if(list.size() > 0){
			int flag=0;
			for(int i=0;i<list.size();i++){
				EquGoodsStoreinSub equGoodsStoreinSub = new EquGoodsStoreinSub();
				equGoodsStoreinSub = (EquGoodsStoreinSub) list.get(i);
				
				if("".equals(equGoodsStoreinSub.getInWarehouseNo()) || equGoodsStoreinSub.getInWarehouseNo()==null || equGoodsStoreinSub.getInWarehouseNo()== 0){
					flag = 2;
					break;
/*				}else if("".equals(equGoodsStoreinSub.getIntoMoney()) || equGoodsStoreinSub.getIntoMoney() ==null || equGoodsStoreinSub.getIntoMoney() == 0){
					flag = 2;
					break;
				}else if("".equals(equGoodsStoreinSub.getTotalMoney()) || equGoodsStoreinSub.getTotalMoney() == null || equGoodsStoreinSub.getTotalMoney() == 0){
					flag = 2;
					break;
				}else if("".equals(equGoodsStoreinSub.getEquno()) || equGoodsStoreinSub.getEquno() == null || "0".equals(equGoodsStoreinSub.getEquno())){
					flag = 2;
					break;*/
				}
			}
			if(flag == 2){
				return 2;
			}else{
				//对完结的数据存入设备库存里面去
				String resule = this.finishEquRkGoodsStorein(uids, pid,judgment,makeType);
				if("success".equals(resule)){
					EquGoodsStorein storein = (EquGoodsStorein) this.equipmentDAO.findById(EquGoodsStorein.class.getName(), uids);
					storein.setFinished((byte) 1);
					storein.setFinishedDate(new Date());
					storein.setFinishedUser(this.getCurrentUserid());
					//完结时自动稽核 pengy 2014-03-06
					storein.setAuditState("1");
					this.equipmentDAO.saveOrUpdate(storein);
					return 0;
				}else{
				    return 1;
				}
			}
		}
		return 1;
	}

    /**
     * @param uids
     * @param pid
     * @param flag判断是异常设备删除还是正常设备删除
     * @做入库是否完结做判断删除主表和字表的相关内容
     */
	@SuppressWarnings("rawtypes")
	public String delEquRkGoodsStorein(String uids,String flag ,String pid) {
		List delList = this.equipmentDAO.findByWhere(EquGoodsStorein.class.getName(), "uids='"+uids+"' and pid='"+pid+"'");
        List list = this.equipmentDAO.findByWhere(EquGoodsStoreinSub.class.getName(), "sbrk_uids='"+uids+"' and  pid='"+pid+"' order by uids");
        EquGoodsStorein equGoodsStorein = new EquGoodsStorein();
        EquGoodsStoreinSub equGoodsStoreinSub= new EquGoodsStoreinSub();
        if(list.size()>0){
        	 for(int i=0;i<list.size();i++){
        		 equGoodsStoreinSub = (EquGoodsStoreinSub) list.get(i);
        		 if("1".equals(flag)){
        			 List delExceUUid = this.equipmentDAO.findByWhere(EquGoodsOpenboxExceView.class.getName(), "uids='"+equGoodsStoreinSub.getBoxSubId()+"'and pid='"+pid+"'");
        			 EquGoodsOpenboxExceView equGoodsOpenboxExceView = (EquGoodsOpenboxExceView)delExceUUid.get(0);
        			 String updataExceIsStoreIn = "update equ_goods_openbox_exce set is_storein='0' where uids='"+equGoodsOpenboxExceView.getUids()+"'";
        			 this.equipmentDAO.updateBySQL(updataExceIsStoreIn);
        		 }
        		//修改主体设备里面的物资修改删除权限
 				String updateSql = "update Equ_Goods_Bodys set del_or_update='1' where equ_no not in (select stockno from ( " +
 							       " select * from EQU_GOODS_STOREIN_ESTIMATE_SUB t union select * from EQU_GOODS_STOREIN_SUB " +
 							       " where  sbrk_uids in ( select uids from EQU_GOODS_STOREIN t where t.data_type='EQUBODY') " +
 							       " and uids<>'"+equGoodsStoreinSub.getUids()+"' )) and equ_name='"+equGoodsStoreinSub.getWarehouseName()+"' and ggxh='"+equGoodsStoreinSub.getGgxh()+"'";
 				this.equipmentDAO.updateBySQL(updateSql);
 				this.equipmentDAO.delete(equGoodsStoreinSub);
        	 }
        }
    	equGoodsStorein = (EquGoodsStorein) delList.get(0);
        if("0".equals(flag)){
			String updataIsStorein = "update equ_goods_openbox set is_storein ='0' where uids='"+equGoodsStorein.getOpenBoxId()+"' and pid='"+pid+"'";
			this.equipmentDAO.updateBySQL(updataIsStorein);
        }
    	this.equipmentDAO.delete(equGoodsStorein);
    	return "success";
	}

    /**
     * @param uids
     * @param AbnormalUids
     * @param pid
     * @根据选择的异常设备对入库详细信息进行新增
     */
	public String addAbnormalList(EquGoodsOpenboxExceView[] obj,String uids,String pid) {
		String updataSql = "update equ_goods_storein t set t.abnormal_or_no = '1' where t.uids='"+uids+"' and t.pid='"+pid+"'";
         for(int i=0;i<obj.length;i++){
        	List getUUid = this.equipmentDAO.findByWhere(EquGoodsOpenboxExceView.class.getName(), "uuid='"+obj[i].getUuid()+"' and pid='"+pid+"'");
        	EquGoodsOpenboxExceView equGoodsOpenboxExceView = (EquGoodsOpenboxExceView)getUUid.get(0);
        	String updataIsStoreIn = "update equ_goods_openbox_exce set is_storein='1' where uids='"+equGoodsOpenboxExceView.getUids()+"' and pid='"+pid+"'";
        	this.equipmentDAO.updateBySQL(updataIsStoreIn);
     		EquGoodsStoreinSub equGoodsStoreinSub = new EquGoodsStoreinSub();
     		equGoodsStoreinSub.setPid(pid);
     		equGoodsStoreinSub.setJzNo(obj[i].getJzNo());
     		equGoodsStoreinSub.setSbrkUids(uids);
     		equGoodsStoreinSub.setBoxSubId(obj[i].getUids());
     		equGoodsStoreinSub.setBoxNo(obj[i].getBoxNo());
     		equGoodsStoreinSub.setStockno(obj[i].getBoxNo());
     		equGoodsStoreinSub.setWarehouseName(obj[i].getEquPartName());
     		equGoodsStoreinSub.setWarehouseType(obj[i].getEquType());
     		equGoodsStoreinSub.setUnit(obj[i].getUnit());
     		equGoodsStoreinSub.setWeight(obj[i].getWeight());
     		equGoodsStoreinSub.setGgxh(obj[i].getGgxh());
     		equGoodsStoreinSub.setGraphNo(obj[i].getGraphNo());
     		equGoodsStoreinSub.setWarehouseNum(obj[i].getApplyInNum());
     		this.equipmentDAO.insert(equGoodsStoreinSub);
         }
         this.equipmentDAO.updateBySQL(updataSql);
		return "success";
	}
	 /**
	  * 对完结的入库单中明细表中的数据进入库存
	  * @param uids
	  * @param pid
	  */
    @SuppressWarnings("unchecked")
	public String finishEquRkGoodsStorein(String uids, String pid,String judgment,String makeType){
		String whereSql = "";
		List<EquGoodsStorein> list = this.equipmentDAO.findByWhere(EquGoodsStorein.class.getName(),
				"uids='" + uids + "' and pid='" + pid + "'");
		EquGoodsStorein equGoodsStorein = list.get(0);
		List<EquGoodsStoreinSub> getSubList = this.equipmentDAO.findByWhere(EquGoodsStoreinSub.class.getName(),
				"sbrk_uids='" + uids + "' and pid='" + pid + "' order by uids");
		// CHFLAG 对非主体设备冲回进行处理，冲回后库存数量要减少
		for (int i = 0; i < getSubList.size(); i++) {
			EquGoodsStock equGoodsStock = new EquGoodsStock();
			EquGoodsStoreinSub obj = getSubList.get(i);
			List<EquGoodsStock> listKC = null;
			if(judgment.equals("body")){
				whereSql = "conid='" + equGoodsStorein.getConid() + "' and pid='" + pid + "' and joinUnit='"
						+ equGoodsStorein.getJoinUnit() + "' and stockNo = '" + obj.getStockno() + "'";
			}else{
				whereSql = "conid='" + equGoodsStorein.getConid() + "' and pid='" + pid + "' and createUnit='"
						+ equGoodsStorein.getCreateUnit() + "' and stockNo = '" + obj.getStockno() + "'";
			}

		    listKC = this.equipmentDAO.findByWhere(EquGoodsStock.class.getName(), whereSql);
//		    	入库前的库存数量beforeInNum，金额beforeInMoney，单价beforeInPrice
		    Double beforeInNum = 0d;
		    Double beforeInMoney = 0d;
//		    Double beforeInPrice = 0d;
			if (listKC == null||listKC.size()==0) {
				equGoodsStock.setPid(pid);
				equGoodsStock.setConid(equGoodsStorein.getConid());
				if(null == obj.getTreeuids() || "".equals(obj.getTreeuids())){
					//对于主体设备，此字段目前在此处没用使用，直接默认获取入库主记录的合同分类树中的分类
					equGoodsStock.setTreeuids(equGoodsStorein.getTreeuids());
				}else{
					//非主体设备的入库，库存中明细对应的分类树，来自开箱检验结果中“设备合同分类树”字段调整后的值，
					//调整后的值，在非主体设备入库明细选择的时候，直接来自与开箱检验结果中的明细。
					//方法SetListEquRkGoodsStorein中有设置
					equGoodsStock.setTreeuids(obj.getTreeuids());
				}
				equGoodsStock.setBoxNo(obj.getBoxNo());
				equGoodsStock.setEquType(obj.getWarehouseType());
				equGoodsStock.setEquPartName(obj.getWarehouseName());
				equGoodsStock.setGgxh(obj.getGgxh());
				equGoodsStock.setGraphNo(obj.getGraphNo());
				equGoodsStock.setUnit(obj.getUnit());
				equGoodsStock.setWeight(obj.getWeight());
				equGoodsStock.setStorage(obj.getEquno());
				equGoodsStock.setStockNum(obj.getInWarehouseNo());
				equGoodsStock.setStorage(obj.getEquno());
				equGoodsStock.setCreateMan(equGoodsStorein.getCreateMan());
				equGoodsStock.setCreateUnit(equGoodsStorein.getCreateUnit());
				equGoodsStock.setJudgment(judgment);
				equGoodsStock.setMakeType("正式入库");
				equGoodsStock.setDataType(equGoodsStorein.getDataType());
				equGoodsStock.setRecordUser(equGoodsStorein.getMakeMan());
				equGoodsStock.setStockNo(obj.getStockno());
				equGoodsStock.setIntoMoney(obj.getIntoMoney());
				equGoodsStock.setKcMoney(obj.getTotalMoney());
				equGoodsStock.setJoinUnit(equGoodsStorein.getJoinUnit());
				equGoodsStock.setSpecial(equGoodsStorein.getSpecial());
				equGoodsStock.setJzNo(obj.getJzNo());
//				equGoodsStock.setEquWz(equGoodsStorein.getEquWz());
				/**
				 * 由于库存中相同设备合并为一条，如果是库存中不存在的设备，则直接取入库金额作为库存金额，
				 * 如果是库存中已存在的设备，则在已有设备的记录上增加入库数量和库存金额，设备类型，规格，单价，单位，仓库号字段覆盖原数据，
				 * 且库存金额已改为库存余额，会随出库而变化，现在已不需要这样计算
				 * pengy 2013-08-08
				 */
				//BUG4948中提到 （物资库存金额为： 完结的入库单中该物资明细的入库金额合计 — 该物资的出库金额合计（出库单是否完结不用考虑））；
				//yanglh 2013-11-20
				if(judgment.equals("body")){
					//统计库存金额：库存金额=该物资所有完结入库单的入库金额合计-该物资所有完结出库单的出库金额合计
					Double getIntoTotalMoney = 0.00;
					Double getOuntTotalMoney = 0.00;
					String where = "sbrkUids in (select uids from EquGoodsStorein where finished='1' and dataType='EQUBODY')"
							+ " and warehouseName='" + obj.getWarehouseName() + "' and warehouseType='" + obj.getWarehouseType()
							+ "' and  stockno='" + obj.getStockno() + "' and ggxh='" + obj.getGgxh() + "'";
					List<EquGoodsStoreinSub> list1 = this.equipmentDAO.findByWhere(EquGoodsStoreinSub.class.getName(), where);
				    if(list1.size()>0){
						for(int k=0;k<list1.size();k++){
					    	EquGoodsStoreinSub sub = list1.get(k);
					    	getIntoTotalMoney += sub.getTotalMoney(); 
					    }
				    }
				    String where2 = "outId in (select uids from EquGoodsStockOut where dataType='EQUBODY') and equPartName='"
							+ obj.getWarehouseName() + "' and equType='" + obj.getWarehouseType() + "' and boxNo='"
							+ obj.getStockno() + "' and ggxh='" + obj.getGgxh() + "'";
				    List<EquGoodsStockOutSub> list2 = this.equipmentDAO.findByWhere(EquGoodsStockOutSub.class.getName(), where2);
	 				if(list2.size()>0){
	 					for(int j=0;j<list2.size();j++){
	 						EquGoodsStockOutSub outSub = list2.get(j);
	 						if(outSub.getAmount() != null)
	 						   getOuntTotalMoney += outSub.getAmount();
	 					}
	 				}
	 				equGoodsStock.setKcMoney(getIntoTotalMoney+obj.getTotalMoney()-getOuntTotalMoney);					
				}else{
					equGoodsStock.setJzNo(obj.getJzNo());
				}
			    this.equipmentDAO.insert(equGoodsStock);
			} else {
				equGoodsStock = (EquGoodsStock) listKC.get(0);
				
				beforeInNum = equGoodsStock.getStockNum() == null ? 0d : equGoodsStock.getStockNum();
//				beforeInPrice = equGoodsStock.getIntoMoney() == null ? 0d : equGoodsStock.getIntoMoney();
			    beforeInMoney = equGoodsStock.getKcMoney() == null ? 0d : equGoodsStock.getKcMoney();
			    
				equGoodsStock.setEquType(obj.getWarehouseType());
				equGoodsStock.setEquPartName(obj.getWarehouseName());
				equGoodsStock.setGgxh(obj.getGgxh());
				equGoodsStock.setUnit(obj.getUnit());
				equGoodsStock.setIntoMoney(obj.getIntoMoney());
				equGoodsStock.setStockNum(beforeInNum + (obj.getInWarehouseNo() == null?0d:obj.getInWarehouseNo()));
				equGoodsStock.setKcMoney(beforeInMoney + (obj.getTotalMoney() == null?0d:obj.getTotalMoney()));
				equGoodsStock.setStorage(obj.getEquno());
				equGoodsStock.setSpecial(equGoodsStorein.getSpecial());
				equGoodsStock.setJzNo(obj.getJzNo());
				this.equipmentDAO.saveOrUpdate(equGoodsStock);
			}
			if(judgment.equals("body")){
				//主体设备入库完结成功后，同时将明细插入物资台帐EQU_GOODS_TZ pengy 2014-08-06
				insertEquGoodsTz(makeType, equGoodsStorein, obj);
			}
		}
		return "success";
	}
	
    /**
     * @param uids设备入库详细信息主键
     * @param pid
     * @根据设备入库详细信息主键找到异常设备然后在删除时更该异常设备的是否存库字段
     */
    public String checkExceBox(String uids,String pid){
    	List checkList = this.equipmentDAO.findByWhere(EquGoodsStoreinSub.class.getName(), "uids='"+uids+"' and pid='"+pid+"'");
    	EquGoodsStoreinSub equGoodsStoreinSub = (EquGoodsStoreinSub)checkList.get(0);
    	String changeExceIsStorein = "update equ_goods_openbox_exce set is_storein='0' " +
    			                     "where uids='"+equGoodsStoreinSub.getBoxSubId()+"' and pid='"+pid+"'";
		this.equipmentDAO.updateBySQL(changeExceIsStorein);
		this.equipmentDAO.delete(equGoodsStoreinSub);
    	return "success";
    	
    }
	//qiupy
	/**
	 * 出库单完结操作
	 * @param uids
	 * @return 1：完结操作成功，2：已安装，不能完结操作。
	 */
	@SuppressWarnings("unchecked")
	public String equOutFinished(String uids){
		EquGoodsStockOut out = (EquGoodsStockOut) this.equipmentDAO.findById(EquGoodsStockOut.class.getName(), uids);
		if(out == null)
			return "0";
		if(out.getIsInstallation() == 1){
			return "2";
		}
		Integer i = out.getFinished();
		out.setFinished( (i == null || i == 0) ? 1 : 0);
		out.setFinishedDate(new Date());
		out.setFinishedUser(this.getCurrentUserid());
		//完结时自动稽核 pengy 2014-03-06
		if(out.getUsing() !=null && !"".equals(out.getUsing())){
			if (out.getUsing().substring(0,2).equals("02")){
				//“领料用途”为“赔偿”的，稽核状态为已稽核-其他
				out.setAuditState("3");
			} else {
				out.setAuditState("1");
			}
		}
		this.equipmentDAO.saveOrUpdate(out);
		
		if(out.getDataType()!=null && out.getDataType().equals("EQUBODY")){
			List<EquGoodsStockOutSub> listSub = this.equipmentDAO.findByWhere(
					EquGoodsStockOutSub.class.getName(), "outId = '" + uids + "'");
			for (int j = 0; j < listSub.size(); j++) {
				//主体设备出库完结成功后，同时将明细插入物资台帐EQU_GOODS_TZ pengy 2014-08-06
				insertEquGoodsTz(out.getType(), out, listSub.get(j));
			}
		}
		return "1";
	}

	/**
	 * 更新设备出库主表信息
	 * @param equOut
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String addOrUpdateEquOut(EquGoodsStockOut equOut){
		String uids = equOut.getUids();
		if (uids == null || uids.equals("")) {
			this.equipmentDAO.insert(equOut);
			return equOut.getUids();
		} else {
			this.equipmentDAO.saveOrUpdate(equOut);
			if(equOut.getDataType() != null && equOut.getDataType().equals("EQUBODY")){
				return equOut.getUids();
		    }else{
/*				String where = " outId = '" + uids + "'";
				List<EquGoodsStockOutSub> list = this.equipmentDAO.findByWhere(
						EquGoodsStockOutSub.class.getName(), where);
	
				// 处理存货编码
				EquGoodsStockOut out = (EquGoodsStockOut) this.equipmentDAO.findById(EquGoodsStockOut.class.getName(), uids);
				List<EquWarehouse> listWare = this.equipmentDAO.findByWhere(
						EquWarehouse.class.getName(), "equid = '" + equOut.getEquid() + "'");
				EquWarehouse warehouse = new EquWarehouse();
				if (listWare.size() > 0) {
					warehouse = listWare.get(0);
				}
				String prefix = warehouse.getWaretypecode() + "-" + warehouse.getWarenocode() + "-";
				String stockno = "";
				String strNum = "select trim(to_char(nvl(max(to_number(substr(box_no, length('"
						+ prefix + "') + 1))),0),'000000')) from equ_goods_stock_out_sub where 1=1"
						+ " and  substr(box_no,1,length('" + prefix + "')) ='" + prefix + "'";
				List<String> listNum = this.equipmentDAO.getDataAutoCloseSes(strNum);
				String sql = "";
				if (listNum != null) {
					if (Integer.valueOf(listNum.get(0)) >= 9999) {
						sql = "select trim(to_char(nvl(max(to_number(substr(box_no, length('"
								+ prefix + "') + 1))),0) + 1,'000000')) from equ_goods_stock_out_sub where 1=1"
								+ " and  substr(box_no,1,length('" + prefix + "')) ='" + prefix + "'";
					} else {
						sql = "select trim(to_char(nvl(max(substr(box_no,length('" + prefix
								+ "') +1, 4)),0) +1,'0000')) " + " from equ_goods_stock_out_sub where 1=1 "
								+ " and  substr(box_no,1,length('" + prefix + "')) ='" + prefix + "'";
					}
				}
				List<String> listStr = this.equipmentDAO.getDataAutoCloseSes(sql);
				if (listStr != null) {
					stockno = listStr.get(0);
				}
				for (int i = 0; i < list.size(); i++) {
					EquGoodsStockOutSub outSub = list.get(i);
					if (outSub != null) {
						outSub.setBoxNo(prefix + stockno);// 存货编码
						this.equipmentDAO.saveOrUpdate(outSub);
						if (stockno.length() > 4) {
							Integer n = Integer.parseInt(stockno);
							stockno = String.format("%06d", n + 1);
						} else {
							Integer n = Integer.parseInt(stockno);
							stockno = String.format("%04d", n + 1);
						}
					}
				}*/
				//yanglh 2013-6-8
				//处理选择领料用途后修改从主体设备选择的出库单明细
				String whereSub = " outId = '" + uids + "'";
				List<EquGoodsStockOutSub>  equSubList = this.equipmentDAO.findByWhere(EquGoodsStockOutSub.class.getName(), whereSub);
				for(int j = 0; j <equSubList.size(); j++){
					 EquGoodsStockOutSub equSub = equSubList.get(j);
					 String str_ = equSub.getEquPartName().replaceAll("'", "''");
		 			 String updateSql = "UPDATE EquGoodsBodys set estimateNo='"+equOut.getUsing()+"' " +
					 		" where equNo='"+equSub.getBoxNo()+"' and equName='"+str_+"'";// and conid='"+equOut.getConid()+"'";
		 			 this.equipmentDAO.executeHQL(updateSql);
				}
				return equOut.getUids();
			}
		}
	}

	/**
	 * 从库存中选择设备到出库单明细
	 * 
	 * @param uids
	 * @param id
	 * @param no
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String insertOutSubFromStock(String[] uids, String id, String no, String flag) {
		String strFlag = "2";
		if (flag.equals("body")) {
			for (int i = 0; i < uids.length; i++) {
				String inSubUids = uids[i];
				EquGoodsStoreinSub inSub = (EquGoodsStoreinSub) this.equipmentDAO.findById(
						EquGoodsStoreinSub.class.getName(), inSubUids);
				EquGoodsStorein in = (EquGoodsStorein) this.equipmentDAO.findById(
						EquGoodsStorein.class.getName(), inSub.getSbrkUids());
				EquGoodsStockOutSub outSub = new EquGoodsStockOutSub();
				List<EquGoodsStock> list = this.equipmentDAO.findByWhere(EquGoodsStock.class.getName(),
						" stockNo='" + inSub.getStockno() + "' AND dataType='EQUBODY' AND makeType='正式入库'");
				EquGoodsStock stock = new EquGoodsStock();
				if (list.size() > 0){
					stock = list.get(0);
				} else {//处理历史没有参与单位的数据
					List<EquGoodsStock> list1 = this.equipmentDAO.findByWhere(
							EquGoodsStock.class.getName(),
							" stockNo='" + inSub.getStockno() + "'" +
							" AND dataType='EQUBODY' AND makeType='正式入库'");
					if (list1!=null&&list1.size() > 0){
						stock = list1.get(0);
					}
				}

				outSub.setOutId(id);
				outSub.setOutNo(no);
				outSub.setPid(inSub.getPid());
				outSub.setEquType(inSub.getWarehouseType());
				outSub.setEquPartName(inSub.getWarehouseName());
				outSub.setGgxh(inSub.getGgxh());
				outSub.setGraphNo(inSub.getGraphNo());
				outSub.setOutNum(0D);
				outSub.setStorage(inSub.getEquno());
				outSub.setUnit(inSub.getUnit());
				outSub.setStockId(stock.getUids());
				outSub.setBoxNo(inSub.getStockno());
				outSub.setPrice(inSub.getIntoMoney());
				outSub.setInSubUids(inSub.getUids());
				outSub.setInNum(inSub.getInWarehouseNo());
				outSub.setJzNo(inSub.getJzNo());
				outSub.setInUids(in.getUids());
				outSub.setSpecial(in.getSpecial());

				String totMonSql = " SELECT nvl(SUM(s.amount),0) FROM equ_goods_stock_out t,equ_goods_stock_out_sub"+
						" s WHERE t.uids = s.out_id AND t.data_type = 'EQUBODY' AND t.type=(select " +
						"case type when '暂估入库' then '暂估出库' else '正式出库' end from Equ_Goods_Storein" +
						" where uids='" + inSub.getSbrkUids() + "') AND s.box_no = '" +
						inSub.getStockno() + "' AND s.in_sub_uids = '" + inSub.getUids() + "' ";

				List<BigDecimal> totalmoney = this.equipmentDAO.getDataAutoCloseSes(totMonSql);
				outSub.setKcMoney(inSub.getTotalMoney() - totalmoney.get(0).doubleValue());
				// 出库从表中的库存余额，直接初始化从入库金额取值

				this.equipmentDAO.saveOrUpdate(outSub);
			}
			strFlag = "1";
		}
		if (flag.equals("nobody")) {
			for (int i = 0; i < uids.length; i++) {
				EquGoodsStock stock = (EquGoodsStock) this.equipmentDAO.findById(
						EquGoodsStock.class.getName(), uids[i]);
				if (stock != null) {
					EquGoodsStockOutSub outSub = new EquGoodsStockOutSub();
					outSub.setOutId(id);
					outSub.setOutNo(no);
					outSub.setPid(stock.getPid());
					outSub.setBoxNo(stock.getStockNo());
					outSub.setEquType(stock.getEquType());
					outSub.setEquPartName(stock.getEquPartName());
					outSub.setGgxh(stock.getGgxh());
					outSub.setGraphNo(stock.getGraphNo());
					outSub.setOutNum(0D);
					outSub.setStorage(stock.getStorage());
					outSub.setUnit(stock.getUnit());
					outSub.setStockId(stock.getUids());
					outSub.setPrice(stock.getIntoMoney());
					outSub.setEquBoxNo(stock.getBoxNo());
					outSub.setJzNo(stock.getJzNo());
					String totMonSql = "select nvl(sum(t.kc_money),0) from equ_goods_stock t where"
							+ " t.judgment ='body' and t.make_type='正式入库' and t.pid='"
							+ stock.getPid() + "' and t.stock_no='" + stock.getStockNo() + "'";
					List<BigDecimal> totalmoney = this.equipmentDAO.getDataAutoCloseSes(totMonSql);
					outSub.setKcMoney(totalmoney.get(0).doubleValue());
					this.equipmentDAO.saveOrUpdate(outSub);
				}
			}
			strFlag = "1";
		}
		return strFlag;
	}

	/**
	 * 从库存中获取设备的库存数量
	 */
	public double getStockNumFromStock(String id){
		EquGoodsStock stock =(EquGoodsStock) this.equipmentDAO.findById(EquGoodsStock.class.getName(), id);
		if(stock!=null){
			return stock.getStockNum();
		}
		return 0d;
	}

	/**
	 * 获取设备出库数量
	 */
	public Long getOutNumFromOutSub(String id){
		EquGoodsStockOutSub sub =(EquGoodsStockOutSub) this.equipmentDAO.findById(EquGoodsStockOutSub.class.getName(), id);
		if(sub!=null){
			return sub.getOutNum().longValue();
		}
		return new Long(0);
	}

	/**
	 * 修改库存数量
	 */
	public int updateStockNum(Double newstocknum, String id, Double amount) {
		String updateSql = "update equ_goods_stock e set e.kc_money = (e.kc_money+"
				+ amount + "),e.stock_Num="+ newstocknum + " where uids='" + id + "'";
		int result = JdbcUtil.update(updateSql);
		return result;
	}

   /**
    * 删除出库单信息，同时删除出库单详细信息，并且更新库存数量
    * <pre>由于流程中删除出库流程时，出库单主表的业务数据会自动被删除，
    * 无法执行此删除方法，同时无法删除从表数据和还原库存中的数量。
    * 因此此处的删除从表和还原库存，改用触发器实现。zhangh 2013-05-15
    * </pre>
    */
	@SuppressWarnings("unchecked")
	public String deleteOutAndOutSub(String uids, String flag) {
		if (uids != null && !"".equals(uids)) {
			EquGoodsStockOut out = (EquGoodsStockOut) this.equipmentDAO.findById(EquGoodsStockOut.class.getName(), uids);
			if (out != null) {
				List<EquGoodsStockOutSub> uousub = this.equipmentDAO.findByWhere(EquGoodsStockOutSub.class.getName(), "outId='" + uids + "'");
				if (uousub.size() > 0) {
					//这里有触发器实现退库和删除从表数据，故注释了 2014-11-18
//					String updateSql = "merge into equ_goods_stock e using "
//							+ "(select s.stock_id,s.out_Num,s.amount from equ_goods_stock_out_sub s where s.out_id='"
//							+ uids
//							+ "' and s.out_Num <> 0) o on(e.uids=o.stock_Id) when matched "
//							+ "then update set e.stock_Num=e.stock_Num+o.out_Num,e.kc_money=e.kc_money+o.amount";
//					String deleteSql = "delete from equ_goods_stock_out_sub s where s.out_id='"
//							+ uids + "'";
					//库存要发生变化 2013-11-20 yanglh
//					if(flag.equals("EQUOTHER")){
//						JdbcUtil.update(updateSql);
//					}
//					JdbcUtil.execute(deleteSql);
				}
				delEquGoodsFinishedRecord(out.getUids());
				this.equipmentDAO.delete(out);
				return "0";
			}
		}
		return "1";
	}

   /**
    * 从出库单明细中选择设备到退库单明细
    */
   public String insertTkSubFromOutSub(String[] uids, String id,String no,String outId,String outNo){
	   EquGoodsStoreTk tk=(EquGoodsStoreTk) this.equipmentDAO.findById(EquGoodsStoreTk.class.getName(), id);
	   tk.setOutId(outId);
	   tk.setOutNo(outNo);
	   this.equipmentDAO.saveOrUpdate(tk);
	   for(int i=0;i<uids.length;i++){
		   EquGoodsStockOutSub outSub=(EquGoodsStockOutSub) this.equipmentDAO.findById(EquGoodsStockOutSub.class.getName(), uids[i]);
			if(outSub!=null){
				EquGoodsStoreTkSub tkSub=new EquGoodsStoreTkSub();
				tkSub.setTkId(id);
				tkSub.setTkNo(no);
				tkSub.setJzNo(outSub.getJzNo());
				tkSub.setPid(outSub.getPid());
				tkSub.setBoxNo(outSub.getBoxNo());
				tkSub.setEquType(outSub.getEquType());
				tkSub.setEquPartName(outSub.getEquPartName());
				tkSub.setGgxh(outSub.getGgxh());
				tkSub.setGraphNo(outSub.getGraphNo());
				tkSub.setTkNum(new Long(0));
				tkSub.setStorage(outSub.getStorage());
				tkSub.setUnit(outSub.getUnit());
				tkSub.setStockId(outSub.getStockId());
				tkSub.setOutSubId(outSub.getUids());
				this.equipmentDAO.saveOrUpdate(tkSub);
			}
	   }
	   return "1";
   }

   /**
    * 退库完结操作  完结时要更新库存设备数量
    */
   public String equTkFinished(String uids){
	   EquGoodsStoreTk tk = (EquGoodsStoreTk) this.equipmentDAO.findById(EquGoodsStoreTk.class.getName(), uids);
		if(tk == null) return "0";
		List<EquGoodsStoreTkSub> tkSubs = this.equipmentDAO.findByWhere(EquGoodsStoreTkSub.class.getName(),"tkId='"+uids+"'");
		Iterator<EquGoodsStoreTkSub> items=tkSubs.iterator();
		while(items.hasNext()){
			EquGoodsStoreTkSub tkSub=items.next();
			if(tkSub.getTkNum()>0){
				String updateSql="update equ_goods_stock e set e.stock_Num=e.stock_Num+"+tkSub.getTkNum()+" where uids='"+tkSub.getStockId()+"'";
				JdbcUtil.update(updateSql);
			}
		}
		Integer i = tk.getFinished(); 
		tk.setFinished( (i == null || i == 0) ? 1 : 0);
		this.equipmentDAO.saveOrUpdate(tk);
		return "1";
   }
   /**
	 * 更新设备退库主表信息
	 * @param equTk
	 * @return
	 */
	public String addOrUpdateEquTk(EquGoodsStoreTk equTk){
		String uids=equTk.getUids();
		if (uids == null || uids.equals("")) {
			this.equipmentDAO.insert(equTk);
			return equTk.getUids();
		}else{
			this.equipmentDAO.saveOrUpdate(equTk);
			return equTk.getUids();
		}
	}
	/**
	 * 删除退库单以及退库单详细信息
	 */
	public String deleteTkAndTkSub(String uids){
		if(uids!=null && !"".equals(uids)){
			EquGoodsStoreTk tk=(EquGoodsStoreTk) this.equipmentDAO.findById(EquGoodsStoreTk.class.getName(), uids);
			   if(tk!=null){
				   List<EquGoodsStoreTkSub> tkSub = this.equipmentDAO.findByWhere(EquGoodsStoreTkSub.class.getName(),"tkId='"+uids+"'");
				   this.equipmentDAO.deleteAll(tkSub);
				   this.equipmentDAO.delete(tk);
				   return "0";
			   }
		   }
		   return "1";
	}
	/**
	 * 
	* @Title: deleteTkSub
	* @Description:  删除退库明细单中的设备信息
	* @param  @param uids
	* @param  @param tkid
	* @param  @return   
	* @return String    
	* @throws
	* @author qiupy 2012-7-20
	 */
	public String deleteTkSub(String[] uids, String tkid){
		if(tkid!=null && !"".equals(tkid)){
			for(int i=0;i<uids.length;i++){
				EquGoodsStoreTkSub tkSub=(EquGoodsStoreTkSub) this.equipmentDAO.findById(EquGoodsStoreTkSub.class.getName(), uids[i]);
				this.equipmentDAO.delete(tkSub);
			}
			List<EquGoodsStoreTkSub> tkSubs= this.equipmentDAO.findByWhere(EquGoodsStoreTkSub.class.getName(),"tkId='"+tkid+"'");
			if(tkSubs.size()==0){
				EquGoodsStoreTk tk=(EquGoodsStoreTk) this.equipmentDAO.findById(EquGoodsStoreTk.class.getName(), tkid);
				tk.setOutId("");
				tk.setOutNo("");
				this.equipmentDAO.saveOrUpdate(tk);
			}
			return "0";
		}
		return "1";
	}
	//zhangh
	 
	
	/**
	 * 更新设备合同信息
	 * @param equCont
	 * @return
	 * @author zhangh 2012-06-27
	 */
	public String addOrUpdateEquCont(EquCont equCont){
		String uids = equCont.getUids(); 
		if (uids == null || uids.equals("")) {
			this.equipmentDAO.insert(equCont);
		}else{
			this.equipmentDAO.saveOrUpdate(equCont);
		}
		return "1";
	}
	
	/**
	 * 更新设备到货主表信息
	 * @param arrival
	 * @return
	 * @author zhangh 2012-06-28
	 */
	public String addOrUpdateEquArrival(EquGoodsArrival arrival){
		String uids = arrival.getUids(); 
		//判断该到货是否已经开箱
		if (uids == null || uids.equals("")) {
			if(arrival.getDhDate()!=null){
				String dhDate = arrival.getDhDate().toString();
				if("Thu Jan 01 08:00:00 CST 1970".equals(dhDate)){
					arrival.setDhDate(null);
				}
			}
			if(arrival.getDemDhDate()!=null){
				String demDhDate = arrival.getDemDhDate().toString();
				if("Thu Jan 01 08:00:00 CST 1970".equals(demDhDate)){
					arrival.setDemDhDate(null);
				}
			}
			if(arrival.getPlaDhDate()!=null){
				String plaDhDate = arrival.getPlaDhDate().toString();
				if("Thu Jan 01 08:00:00 CST 1970".equals(plaDhDate)){
					arrival.setPlaDhDate(null);
				}
			}
			this.equipmentDAO.insert(arrival);
			return arrival.getUids();
		}else{
			if(arrival.getDhDate()!=null){
				String dhDate = arrival.getDhDate().toString();
				if("Thu Jan 01 08:00:00 CST 1970".equals(dhDate)){
					arrival.setDhDate(null);
				}
			}
			if(arrival.getDemDhDate()!=null){
				String demDhDate = arrival.getDemDhDate().toString();
				if("Thu Jan 01 08:00:00 CST 1970".equals(demDhDate)){
					arrival.setDemDhDate(null);
				}
			}
			if(arrival.getPlaDhDate()!=null){
				String plaDhDate = arrival.getPlaDhDate().toString();
				if("Thu Jan 01 08:00:00 CST 1970".equals(plaDhDate)){
					arrival.setPlaDhDate(null);
				}
			}
			this.equipmentDAO.saveOrUpdate(arrival);
			return arrival.getUids();
		}
	}
	
	/**
	 * 判断到货单是否已经开箱。
	 * @param uids
	 * @return
	 * @author zhangh 2012-06-29
	 */
	public Boolean equArrivalIsBoxOpen(String uids){
		EquGoodsArrival arrival = (EquGoodsArrival) this.equipmentDAO.findById(
				EquGoodsArrival.class.getName(), uids);
		if(arrival == null){
			return false;
		}else{
			if(arrival.getIsOpen() == 1){
				return true;	
			}else{
				return false;
			}
		}
	}
	
	/**
	 * 到货单完结操作
	 * @param uids
	 * @return 1：完结操作成功，2：已开箱，不能完结操作。
	 * @author zhangh 2012-06-29
	 */
	public String equArrivalFinished(String uids){
		EquGoodsArrival arrival = (EquGoodsArrival) this.equipmentDAO.findById(
				EquGoodsArrival.class.getName(), uids);
		if(arrival == null) return "0";
		if(arrival.getIsOpen() == 1){
			return "2";
		}
		Integer i = arrival.getFinished(); 
		arrival.setFinished( (i == null || i == 0) ? 1 : 0);
		this.equipmentDAO.saveOrUpdate(arrival);
		return "1";
	}
	
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
	@SuppressWarnings("unchecked")
	public String getEquNewDhNo(String pid, String prefix, String col, String table, Long lsh) {
		String bh = "";
		String newLsh = "";
		if (lsh == null) {
			String strNum = "select trim(to_char(nvl(max(to_number(substr("
					+ col + ", length('" + prefix + "') + 1))),0),'000000')) from "
					+ table + " where pid = '" + pid + "' and substr(" + col
					+ ", 1, length('" + prefix + "')) = '" + prefix + "'";
			List<String> listNum = this.equipmentDAO.getDataAutoCloseSes(strNum);
			String sql = "";
			if (listNum != null) {
				if (Integer.valueOf(listNum.get(0)) >= 9999) {
					sql = "select trim(to_char(nvl(max(to_number(substr(" + col
							+ ", length('" + prefix + "') + 1))),0) + 1,'000000')) from "
							+ table + " where pid = '" + pid + "' and substr(" + col
							+ ", 1, length('" + prefix + "')) = '" + prefix + "'";
				} else {
					sql = "select trim(to_char(nvl(max(substr(" + col + ",length('"
							+ prefix + "') +1, 4)),0) +1,'0000')) from " + table
							+ " where pid = '" + pid + "' and  substr(" + col
							+ ",1,length('" + prefix + "')) ='" + prefix + "'";
				}
			}
			List<String> list = this.equipmentDAO.getDataAutoCloseSes(sql);
			if (list != null) {
				newLsh = list.get(0);
			}
		} else {
			NumberFormat ft = NumberFormat.getNumberInstance();
			ft.setMinimumIntegerDigits(4);
			ft.setGroupingUsed(false);
			newLsh = ft.format(lsh);
		}
		bh = prefix.concat(newLsh);
		return bh;
	}
	
	
	/**
	 * 更新设备开箱检验通知单主表信息
	 * @param notice
	 * @return
	 * @author zhangh 2012-07-02
	 */
	public String addOrUpdateEquOpenboxNotice(EquGoodsOpenboxNotice notice){
		String uids = notice.getUids(); 
		if (uids == null || uids.equals("")) {
			if(notice.getEquArriveDate() !=null){
				String equArriveDate = notice.getEquArriveDate().toString();
				if("Thu Jan 01 08:00:00 CST 1970".equals(equArriveDate)){
					notice.setEquArriveDate(null);
				}
			}
			this.equipmentDAO.insert(notice);
			return notice.getUids();
		}else{
			if(notice.getEquArriveDate() !=null){
				String equArriveDate = notice.getEquArriveDate().toString();
				if("Thu Jan 01 08:00:00 CST 1970".equals(equArriveDate)){
					notice.setEquArriveDate(null);
				}
			}
			this.equipmentDAO.saveOrUpdate(notice);
			return notice.getUids();
		}
	}
	
	/**
	 * 从到货单明细中选择设备到开箱通知单明细
	 * @param uids	已选择的明细主键
	 * @param id	开箱通知单主键
	 * @param no	开箱通知单批次号
	 * @author zhangh 2012-07-03
	 * @return
	 */
	public String insertNoticeSubFromArrivalSub(String[] uids, String id,String no) {
		for (int i = 0; i < uids.length; i++) {
			EquGoodsArrivalSub arrivalSub = (EquGoodsArrivalSub) this.equipmentDAO
					.findById(EquGoodsArrivalSub.class.getName(), uids[i]);
			if(arrivalSub != null){
				EquGoodsOpenboxNoticeSub sub = new EquGoodsOpenboxNoticeSub();
				sub.setNoticeId(id);
				sub.setNoticeNo(no);
				sub.setPid(arrivalSub.getPid());
				
				sub.setBoxType(arrivalSub.getBoxType());
				sub.setJzNo(arrivalSub.getJzNo());
				sub.setBoxNo(arrivalSub.getBoxNo());
				sub.setBoxName(arrivalSub.getBoxName());
				sub.setGgxh(arrivalSub.getGgxh());
				sub.setGraphNo(arrivalSub.getGraphNo());
				sub.setUnit(arrivalSub.getUnit());
				sub.setOpenNum(arrivalSub.getRealNum());
				sub.setWeight(arrivalSub.getWeight());
				sub.setArrivalSubId(uids[i]);
				sub.setArrivalNo(arrivalSub.getArrivalNo());
				this.equipmentDAO.saveOrUpdate(sub);
				
				String sql = "update equ_goods_arrival set is_open=1 " +
						" where uids = '"+arrivalSub.getArrivalId()+"'";
				JdbcUtil.update(sql);
			}
		}
		return "1";
	}

	/**
	 * 检验通知单完结操作
	 * @param uids
	 * @return 1：完结操作成功，2：已检验，不能完结操作。
	 * @author zhangh 2012-07-03
	 */
	public String equNoticeFinished(String uids){
		EquGoodsOpenboxNotice notice = (EquGoodsOpenboxNotice) this.equipmentDAO.findById(
				EquGoodsOpenboxNotice.class.getName(), uids);
		if(notice == null) return "0";
		if(notice.getIsCheck() == 1){
			return "2";
		}
		Integer i = notice.getFinished(); 
		notice.setFinished( (i == null || i == 0) ? 1 : 0);
		this.equipmentDAO.saveOrUpdate(notice);
		return "1";
	}

	/**
	 * 更新设备开箱检验单主表信息
	 * @param notice
	 * @return
	 * @author zhangh 2012-07-04
	 */
	public String addOrUpdateEquOpenbox(EquGoodsOpenbox openbox){
		String uids = openbox.getUids(); 
		if (uids == null || uids.equals("")) {
			this.equipmentDAO.insert(openbox);
			return openbox.getUids();
		}else{
			this.equipmentDAO.saveOrUpdate(openbox);
			return openbox.getUids();
		}
	}

	/**
	 * 根据开箱检验单主键删除从表数据
	 * @param openboxId
	 * @author zhangh 2012-07-04
	 */
	@SuppressWarnings("unchecked")
	public void deleteEquOpenboxSub(String openboxUids){
		List<EquGoodsOpenboxSub> list = this.equipmentDAO.findByWhere(EquGoodsOpenboxSub.class.getName(), "openboxId = '"+openboxUids+"'");
		if (list!=null && list.size()>0) {
			this.equipmentDAO.deleteAll(list);
		}
		//删除与开箱检验单关联的所有部件
		List<EquGoodsOpenboxSubPart> listPart = this.equipmentDAO.findByWhere(EquGoodsOpenboxSubPart.class.getName(), "openboxId = '"+openboxUids+"'");
		if(listPart!=null && list.size()>0){
			this.equipmentDAO.deleteAll(listPart);
		}
	}

	/**
	 * 检验单中选择到货单，同步将通知单中设备存入检验单，检验单中设备基本属性与到货单中属性相同
	 * @param openboxUids
	 * @param noticeUids
	 * @return
	 * @author zhangh 2012-07-04
	 */
	@SuppressWarnings("unchecked")
	public String getOpenboxSubFromNotice(String openboxUids, String noticeUids){
		deleteEquOpenboxSub(openboxUids);

		EquGoodsOpenbox openbox = (EquGoodsOpenbox) this.equipmentDAO.findById(
				EquGoodsOpenbox.class.getName(), openboxUids);
		EquGoodsOpenboxNotice notice = (EquGoodsOpenboxNotice) this.equipmentDAO
				.findById(EquGoodsOpenboxNotice.class.getName(), noticeUids);
		openbox.setNoticeId(notice.getUids());
		openbox.setNoticeNo(notice.getNoticeNo());
		this.equipmentDAO.saveOrUpdate(openbox);

		List<EquGoodsOpenboxNoticeSub> list = this.equipmentDAO.findByWhere(
				EquGoodsOpenboxNoticeSub.class.getName(), "noticeId='"+noticeUids+"'");
		
		//设备合同分类树uid和设备类型	1为主设备，2为备品备件，3为专用工具
		String uid = "";
		String equType = "";
		//获得设备合同分类树 的uid
		String hql1 = "uuid='"+openbox.getTreeuids()+"'";
		List<EquTypeTree> con = this.equipmentDAO.findByWhere(EquTypeTree.class.getName(), hql1);
		if(con != null && con.size()>0){
			String treeid = con.get(0).getTreeid();
			String parentid = con.get(0).getParentid();
			if(treeid.equals("01") || treeid.equals("02") || treeid.equals("03")){
				uid = con.get(0).getUuid();
				equType = treeid.substring(1);
			}else if(parentid.equals("0")){
				//如果选择的是合同，设备合同分类树默认取值  '主设备' 的uid
				String hql2 = "conid='"+openbox.getConid()+"' and treeid = '01'";
				List<EquTypeTree> zsb = this.equipmentDAO.findByWhere(EquTypeTree.class.getName(), hql2);
				if(zsb != null && zsb.size()>0){
					uid = zsb.get(0).getUuid();
					equType = "1";
				}
			}else{
				//如果选择的是设备合同树的子节点，设备类型为三级节点，即1,2,3
				uid = openbox.getTreeuids();
				equType = findEquType(treeid,openbox.getConid());
			}
		}
				
		for (int i = 0; i < list.size(); i++) {
			EquGoodsOpenboxSub sub = new EquGoodsOpenboxSub();
			sub.setOpenboxId(openbox.getUids());
			sub.setOpenboxNo(openbox.getOpenNo());

			EquGoodsOpenboxNoticeSub noticeSub = list.get(i);
			EquGoodsArrivalSub arrivalSub = (EquGoodsArrivalSub) this.equipmentDAO
					.findById(EquGoodsArrivalSub.class.getName(), noticeSub.getArrivalSubId());

			//裸件 默认给设备合同分类树及设备类型赋值
			if(arrivalSub.getBoxType().equals("02")){
				sub.setTreeuids(uid);
				sub.setEquType(equType);
			}

			sub.setPid(arrivalSub.getPid());
			sub.setBoxType(arrivalSub.getBoxType());
			sub.setJzNo(arrivalSub.getJzNo());
			sub.setBoxNo(arrivalSub.getBoxNo());
			sub.setBoxName(arrivalSub.getBoxName());
			sub.setGgxh(arrivalSub.getGgxh());
			sub.setGraphNo(arrivalSub.getGraphNo());
			sub.setUnit(arrivalSub.getUnit());
			sub.setMustNum(arrivalSub.getMustNum());
			sub.setRealNum(arrivalSub.getRealNum());
			sub.setWeight(arrivalSub.getWeight());
			sub.setPackType(arrivalSub.getPackType());
			sub.setStorage(arrivalSub.getStorage());
			sub.setException(arrivalSub.getException());
			sub.setExceptionDesc(arrivalSub.getExceptionDesc());
			sub.setRemark(arrivalSub.getRemark());
			
			this.equipmentDAO.saveOrUpdate(sub);
		}
		
		String sql = "update equ_goods_openbox_notice set is_check=1 " +
			" where uids = '"+noticeUids+"'";
		JdbcUtil.update(sql);
		
		return "1";
	}

	/**
	 * 初始化开箱检验结果
	 * @param openboxUids
	 * @return
	 * @author zhangh 2012-07-05
	 */
	@SuppressWarnings("unchecked")
	public String initEquOpenboxResult(String openboxUids) {
		EquGoodsOpenbox openbox = (EquGoodsOpenbox) this.equipmentDAO.findById(
				EquGoodsOpenbox.class.getName(), openboxUids);
		if(openbox == null)
			return "0";
		
		//boxType 01为部件，02为裸件
		String errMsg = "";
		List<EquGoodsOpenboxSub> listSub01 = this.equipmentDAO.findByWhere(
				EquGoodsOpenboxSub.class.getName(), "openboxId='"+openboxUids+"' and boxType='01'");
		List<EquGoodsOpenboxSub> listSub02 = this.equipmentDAO.findByWhere(
				EquGoodsOpenboxSub.class.getName(), "openboxId='"+openboxUids+"' and boxType='02'");
		//检验与开箱通知单对应的部件明细中是否存在“空箱或者裸件未对应设备合同分类树”的情况
		//检查部件
		for (int i = 0; i < listSub01.size(); i++) {
			EquGoodsOpenboxSub sub = listSub01.get(i);
			String subUids = sub.getUids();
			List<EquGoodsOpenboxSubPart> listPart = this.equipmentDAO.findByWhere(
					EquGoodsOpenboxSubPart.class.getName(), "openboxSubId='"+subUids+"'");
			if(listPart == null || listPart.size() == 0){
				errMsg += "【"+sub.getBoxNo()+"】"+sub.getBoxName()+"<br>";
			}
		}
		errMsg +="|";
		for (int i = 0; i < listSub02.size(); i++) {
			EquGoodsOpenboxSub sub = listSub02.get(i);
			if(sub.getTreeuids()==null || sub.getTreeuids().equals("")){
				errMsg += "【"+sub.getBoxNo()+"】"+sub.getBoxName()+"<br>";
			}
		}
		if(!errMsg.equals("|"))
			return errMsg;
		
		//检查完成，开始初始化数据
		//初始化之前删除已有数据
		List<EquGoodsOpenboxResult> list = this.equipmentDAO.findByWhere(
				EquGoodsOpenboxResult.class.getName(), "openboxId='"+openboxUids+"'");
		this.equipmentDAO.deleteAll(list);
		
		//直接查询出当前开箱检验单下所有部件
		List<EquGoodsOpenboxSubPart> listPart = this.equipmentDAO.findByWhere(
				EquGoodsOpenboxSubPart.class.getName(), "openboxId='"+openboxUids+"'");
		for (int j = 0; j < listPart.size(); j++) {
			EquGoodsOpenboxSubPart part = listPart.get(j);
			EquGoodsOpenboxResult result = new EquGoodsOpenboxResult();
			
			result.setPid(part.getPid());
			result.setOpenboxId(part.getOpenboxId());
			result.setOpenboxNo(part.getOpenboxNo());
			result.setTreeuids(part.getTreeuids());
			result.setEquType(part.getEquType());
			result.setJzNo(part.getJzNo());
			result.setBoxNo(part.getBoxNo());
			result.setEquPartName(part.getEquPartName());
			result.setGgxh(part.getGgxh());
			result.setBoxinNum(part.getBoxinNum());
			result.setUnit(part.getUnit());
			result.setWeight(part.getWeight());
			result.setGraphNo(part.getGraphNo());
			result.setRealNum(part.getBoxinNum());
			result.setPassNum(part.getBoxinNum());
			result.setExceNum(0d);
			result.setStorage(part.getStorage());
			this.equipmentDAO.saveOrUpdate(result);
		}
		//所有裸件
		for (int i = 0; i < listSub02.size(); i++) {
			EquGoodsOpenboxSub sub = listSub02.get(i);
			EquGoodsOpenboxResult result = new EquGoodsOpenboxResult();
			
			result.setPid(sub.getPid());
			result.setOpenboxId(sub.getOpenboxId());
			result.setOpenboxNo(sub.getOpenboxNo());
			result.setTreeuids(sub.getTreeuids());
			result.setEquType(sub.getEquType());
			result.setJzNo(sub.getJzNo());
			result.setBoxNo(sub.getBoxNo());
			result.setEquPartName(sub.getBoxName());
			result.setGgxh(sub.getGgxh());
			result.setBoxinNum(sub.getRealNum());
			result.setUnit(sub.getUnit());
			result.setWeight(sub.getWeight());
			result.setGraphNo(sub.getGraphNo());
			result.setRealNum(sub.getRealNum());
			result.setPassNum(sub.getRealNum());
			result.setExceNum(0d);
			result.setStorage(sub.getStorage());
			this.equipmentDAO.saveOrUpdate(result);
		}
		
		return "1";
	}
	
	
	/**
	 * 开箱检验单完结操作
	 * @param uids
	 * @return 1：完结操作成功，2：已入库，不能完结操作，3：检验结果数据不完整，不能完结操作。
	 * @author zhangh 2012-07-05
	 */
	public String equOpenboxFinished(String uids){
		EquGoodsOpenbox openbox = (EquGoodsOpenbox) this.equipmentDAO.findById(
				EquGoodsOpenbox.class.getName(), uids);
		if(openbox == null) 
			return "0";
		List<EquGoodsOpenboxResult> list = this.equipmentDAO.findByWhere(
				EquGoodsOpenboxResult.class.getName(), "openboxId='"+uids+"'");
		if(list == null || list.size() == 0)
			return "3";
		for (int i = 0; i < list.size(); i++) {
			EquGoodsOpenboxResult result = list.get(i);
			Double pass = (result.getPassNum() == null?Double.valueOf("0"):result.getPassNum().doubleValue());
			Double exce= (result.getExceNum() == null?Double.valueOf("0"):result.getExceNum().doubleValue());
			Double boxInNum = (result.getBoxinNum()== null?Double.valueOf("0"):result.getBoxinNum().doubleValue());
			if(pass == null || (pass+exce)!=boxInNum)
				return "3";
		}
		if(openbox.getIsStorein() == 1)
			return "2";
		Integer i = openbox.getFinished(); 
		openbox.setFinished( (i == null || i == 0) ? 1 : 0);
		this.equipmentDAO.saveOrUpdate(openbox);
		return "1";
	}
	
	
	/**
	 * 保存异常处理结果
	 * @param exceArr
	 * @return
	 * @author zhangh 2012-07-06
	 */
	public String saveEquOpenboxException(EquGoodsOpenboxExce[] exceArr){
		for (int i = 0; i < exceArr.length; i++) {
			EquGoodsOpenboxExce exce = exceArr[i];
			String uids = exce.getUids();
			if(uids == null || uids.equals(""))
				this.equipmentDAO.insert(exce);
			else
				this.equipmentDAO.saveOrUpdate(exce);
		}
		return "1";
	}
	
	/**
	 * 异常处理结果完结操作
	 * @param uids
	 * @return 1：完结操作成功，2：已入库，不能完结操作，3：异常还没有处理，不能完结
	 * @author zhangh 2012-07-06
	 */
	public String equOpenboxExceFinished(String uids){
		EquGoodsOpenboxExce openboxExce = (EquGoodsOpenboxExce) this.equipmentDAO.findById(
				EquGoodsOpenboxExce.class.getName(), uids);
		if(openboxExce == null) 
			return "3";
		if(openboxExce.getIsStorein() != null && openboxExce.getIsStorein() == 1)
			return "2";
		Integer i = openboxExce.getFinished(); 
		openboxExce.setFinished( (i == null || i == 0) ? 1 : 0);
		this.equipmentDAO.saveOrUpdate(openboxExce);
		return "1";
	}

	/**
	 * 删除到货单
	 * @param uids
	 * @return
	 * @author zhangh 2012-07-13
	 */
	@SuppressWarnings("unchecked")
	public String deleteArrival(String uids){
		//删除从表数据
		List<EquGoodsArrivalSub> list = this.equipmentDAO.findByWhere(EquGoodsArrivalSub.class.getName(), "arrivalId = '"+uids+"'");
		if(list.size() > 0)
			this.equipmentDAO.deleteAll(list);
		//删除附件数据
		List<EquFile> listFile = this.equipmentDAO.findByWhere(EquFile.class.getName(), "mainid = '"+uids+"'");
		if(listFile.size() > 0)
			this.equipmentDAO.deleteAll(listFile);
		EquGoodsArrival arrival = (EquGoodsArrival) this.equipmentDAO.findById(EquGoodsArrival.class.getName(), uids);
		this.equipmentDAO.delete(arrival);
		return "1";
	}

	/**
	 * 删除开箱通知单
	 * @param uids
	 * @return
	 * @author zhangh 2012-07-13
	 */
	@SuppressWarnings("unchecked")
	public String deleteOpenboxNotice(String uids){
		//删除从表数据
		List<EquGoodsOpenboxNoticeSub> list = this.equipmentDAO.findByWhere(EquGoodsOpenboxNoticeSub.class.getName(), "noticeId = '"+uids+"'");
		if(list.size() > 0)
			this.equipmentDAO.deleteAll(list);
		//删除附件数据
		List<EquFile> listFile = this.equipmentDAO.findByWhere(EquFile.class.getName(), "mainid = '"+uids+"'");
		if(listFile.size() > 0)
			this.equipmentDAO.deleteAll(listFile);
		EquGoodsOpenboxNotice notice = (EquGoodsOpenboxNotice) this.equipmentDAO.findById(EquGoodsOpenboxNotice.class.getName(), uids);
		this.equipmentDAO.delete(notice);
		return "1";
	}
	
	/**
	 * 删除开箱检验单
	 * @param uids
	 * @return
	 * @author zhangh 2012-07-13
	 */
	@SuppressWarnings("unchecked")
	public String deleteOpenbox(String uids){
		//删除从表数据
		List<EquGoodsOpenboxSub> list1 = this.equipmentDAO.findByWhere(EquGoodsOpenboxSub.class.getName(), "openboxId = '"+uids+"'");
		if(list1.size() > 0)
			this.equipmentDAO.deleteAll(list1);
		//删除部件
		List<EquGoodsOpenboxSubPart> list2 = this.equipmentDAO.findByWhere(EquGoodsOpenboxSubPart.class.getName(), "openboxId = '"+uids+"'");
		if(list2.size() > 0)
			this.equipmentDAO.deleteAll(list2);
		//删除检验结果
		List<EquGoodsOpenboxResult> list3 = this.equipmentDAO.findByWhere(EquGoodsOpenboxResult.class.getName(), "openboxId = '"+uids+"'");
		if(list3.size() > 0)
			this.equipmentDAO.deleteAll(list3);
		//删除对应异常
		List<EquGoodsOpenboxExce> list4 = this.equipmentDAO.findByWhere(EquGoodsOpenboxExce.class.getName(), "openboxId = '"+uids+"'");
		if(list4.size() > 0)
			this.equipmentDAO.deleteAll(list4);
		//删除开箱检验单主表
		EquGoodsOpenbox openbox = (EquGoodsOpenbox) this.equipmentDAO.findById(EquGoodsOpenbox.class.getName(), uids);
		this.equipmentDAO.delete(openbox);
		return "1";
	}
	
	/**
	 * 保存提醒时间和范围
	 * @param views
	 * @return
	 * @author zhangh 2012-07-16
	 */
	public String saveUrge(EquGoodsUrgeView[] views){
		for (int i = 0; i < views.length; i++) {
			EquGoodsUrgeView view = views[i];
			EquJzDate jzDate = (EquJzDate) this.equipmentDAO.findById(EquJzDate.class.getName(), view.getUids());
			jzDate.setRemindDate(view.getRemindDate());
			jzDate.setRemindRange(view.getRemindRange());
			this.equipmentDAO.saveOrUpdate(jzDate);
		}
		return "1";
	}
	
	/**
	 * 催交完结操作
	 * @param uids
	 * @return 1：完结操作成功
	 * @author zhangh 2012-07-16
	 */
	public String equEquJzDateFinished(String uids){
		EquJzDate jzDate = (EquJzDate) this.equipmentDAO.findById(
				EquJzDate.class.getName(), uids);
		if(jzDate == null) return "0";
		Integer i = jzDate.getFinished(); 
		jzDate.setFinished( (i == null || i == 0) ? 1 : 0);
		this.equipmentDAO.saveOrUpdate(jzDate);
		return "1";
	}
	
	/**
	 * 设置提醒范围
	 * @param uids 催交主表（EQU_JZ_DATE）主键
	 * @param type unit：按单位选择，user：按用户选择，group：按分组选择
	 * @param idArr 选中的类型的主键
	 * @param pid
	 * @return
	 * @author zhangh 2012-07-17
	 */
	@SuppressWarnings("unchecked")
	public String setRemindRange(String uids, String type, String[] idArr, String pid){
		EquJzDate jzDate = (EquJzDate) this.equipmentDAO.findById(EquJzDate.class.getName(), uids);
		if(jzDate == null) return "0";
		String where = "";
		for (int i = 0; i < idArr.length; i++) {
			
			if(type.equals("unit")){
				//根据单位查用户，idArr为unitid
				where = "deptId = '"+idArr[i]+"'";
				List<RockUser> listUser = this.equipmentDAO.findByWhere(RockUser.class.getName(), where);
				for (int j = 0; j < listUser.size(); j++) {
					//存在相同提醒范围不重复添加
					where = " remindType='"+type+"' and jzDateId = '"+jzDate.getUids()+"' and userid='"+listUser.get(j).getUserid()+"' ";
					List<EquGoodsUrgeRemind> list = this.equipmentDAO.findByWhere(EquGoodsUrgeRemind.class.getName(), where);
					if(list!=null&&list.size()>0) continue;
					
					EquGoodsUrgeRemind remind = new EquGoodsUrgeRemind();
					remind.setPid(pid);
					remind.setJzDateId(jzDate.getUids());
					remind.setRemindType(type);
					remind.setMainid(idArr[i]);
					remind.setUserid(listUser.get(j).getUserid());
					this.equipmentDAO.saveOrUpdate(remind);
				}
			}else if(type.equals("group")){
				where = "groupid = '"+idArr[i]+"'";
				List<EquGoodsUrgeGroupUser> listGroupUser = this.equipmentDAO.findByWhere(EquGoodsUrgeGroupUser.class.getName(), where);
				for (int j = 0; j < listGroupUser.size(); j++) {
					//存在相同提醒范围不重复添加
					where = " remindType='"+type+"' and jzDateId = '"+jzDate.getUids()+"' and userid='"+listGroupUser.get(j).getUserid()+"' ";
					List<EquGoodsUrgeRemind> list = this.equipmentDAO.findByWhere(EquGoodsUrgeRemind.class.getName(), where);
					if(list!=null&&list.size()>0) continue;
					
					EquGoodsUrgeRemind remind = new EquGoodsUrgeRemind();
					remind.setPid(pid);
					remind.setJzDateId(jzDate.getUids());
					remind.setRemindType(type);
					remind.setMainid(idArr[i]);
					remind.setUserid(listGroupUser.get(j).getUserid());
					this.equipmentDAO.saveOrUpdate(remind);
				}
			}else if(type.equals("user")){
				//存在相同提醒范围不重复添加
				where = " remindType='"+type+"' and jzDateId = '"+jzDate.getUids()+"' and userid='"+idArr[i]+"' ";
				List<EquGoodsUrgeRemind> list = this.equipmentDAO.findByWhere(EquGoodsUrgeRemind.class.getName(), where);
				if(list!=null&&list.size()>0) continue;
				
				EquGoodsUrgeRemind remind = new EquGoodsUrgeRemind();
				remind.setPid(pid);
				remind.setJzDateId(jzDate.getUids());
				remind.setRemindType(type);
				remind.setMainid(idArr[i]);
				remind.setUserid(idArr[i]);
				this.equipmentDAO.saveOrUpdate(remind);
			}
		}
		if(idArr.length > 0){
			jzDate.setRemindRange("已设置");
			this.equipmentDAO.saveOrUpdate(jzDate);
		}
		return "1";
	}

	/**
	 * 保存分组
	 * @param groupname
	 * @param pid
	 * @param jzDateUids
	 * @param userArr
	 * @return
	 * @author zhangh 2012-07-17
	 */
	@SuppressWarnings("unchecked")
	public String saveGroup(String groupname,String pid,String jzDateUids,String[] userArr){
		List<EquGoodsUrgeGroup> list = this.equipmentDAO.findByWhere(EquGoodsUrgeGroup.class.getName(), "groupname='"+groupname+"'");
		String groupid = "";
		if(list != null && list.size() > 0){
			EquGoodsUrgeGroup group = (EquGoodsUrgeGroup) list.get(0);
			groupid = group.getUids();
		}else{
			EquGoodsUrgeGroup group = new EquGoodsUrgeGroup();
			group.setGroupname(groupname);
			group.setJzDateId(jzDateUids);
			group.setPid(pid);
			this.equipmentDAO.insert(group);
			groupid = group.getUids();
		}
		for (int i = 0; i < userArr.length; i++) {
			EquGoodsUrgeGroupUser user = new EquGoodsUrgeGroupUser();
			String userid = userArr[i];
			List<EquGoodsUrgeGroupUser> listUser = this.equipmentDAO.findByWhere(EquGoodsUrgeGroupUser.class.getName(),
					"userid='" + userid + "' and jzDateId='" + jzDateUids + "' and groupid='" + groupid + "'");
			if(listUser.size() > 0)continue;
			user.setUserid(userid);
			user.setJzDateId(jzDateUids);
			user.setGroupid(groupid);	
			this.equipmentDAO.insert(user);
		}
		return "1";
	}
	
	/**
	 * 删除分组
	 * @param uids
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String deleteEquUrgeGroup(String[] uidsArr){
		for (int i = 0; i < uidsArr.length; i++) {
			String uids = uidsArr[i];
			List<EquGoodsUrgeGroupUser> list = this.equipmentDAO.findByWhere(EquGoodsUrgeGroupUser.class.getName(), "groupid = '"+uids+"'");
			if (list!=null && list.size()>0) {
				this.equipmentDAO.deleteAll(list);
			}
			EquGoodsUrgeGroup group = (EquGoodsUrgeGroup) this.equipmentDAO.findById(EquGoodsUrgeGroup.class.getName(), uids);
			this.equipmentDAO.delete(group);
		}
		return "1";
	}
	
	
	/**
	 * 设备催交提醒短信发送
	 * @author zhangh 2012-07-18
	 */
	@SuppressWarnings("unchecked")
	public void sendSmsByEquUrgeRemind(){
		try {
			InputStream is = this.getClass().getResourceAsStream("/sendmessage_sgcc.properties");
			Properties props = new Properties();
			props.load(is);
			String isSendMessage = props.getProperty("IS_SENDMESSAGE");  // 是否需要发送短信
			is.close();
			
			if(isSendMessage.equals("true")){
				//获取系统时间
				Date date = new Date();
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
				String nowDate = sdf.format(date);
				
				//查询未完结并且到了提醒时间的机组交货信息
				String where = " finished='0' and remindDate <= to_date('"+nowDate+"','YYYY-MM-DD')";
				List<EquJzDate> listJzDate = this.equipmentDAO.findByWhere(EquJzDate.class.getName(), where);
				//根据机组交货信息查询提醒用户
				for (int i = 0; i < listJzDate.size(); i++) {
					EquJzDate jzDate = listJzDate.get(i);
					where = "jzDateId = '"+jzDate.getUids()+"'";
					List<EquGoodsUrgeRemind> listRemind = this.equipmentDAO.findByWhere(EquGoodsUrgeRemind.class.getName(), where);
					
					for (int j = 0; j < listRemind.size(); j++) {
						EquGoodsUrgeRemind remind = listRemind.get(j);
						//查询用户
						RockUser user = (RockUser) this.equipmentDAO.findById(RockUser.class.getName(), remind.getUserid());
						if(user.getMobile() == null || user.getMobile().equals("")) continue;
						// 缺少短信具体内容，短信发送未测试 zhangh 2012-07-19
						String content = "发送设备催交内容";
						//短信接收号码
						String mobile = user.getMobile();
						 this.sendMessage.sendASms(content,mobile);
					}
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	
	/**
	 * 粘贴开箱管理中的部件录入明细
	 * @param parts
	 * @return
	 * @author zhangh 2012-09-06
	 */
	public String pasteEquOpenboxPart(EquGoodsOpenboxSubPart[] parts){
		for (int i = 0; i < parts.length; i++) {
			this.equipmentDAO.insert(parts[i]);
		}
		return "1";
	}
	
	/**
	 * 根据业务类型，获取最新的数据导出Excel报表模板信息；
	 * @param businessType
	 * @return
	 */
	public InputStream getExcelTemplate(String businessType){
		InputStream ins = null;
		String templateSql = "select fileid from app_template t where templatecode='" + businessType + "' order by lastmodify desc";
		List<Map<String, String>> l = JdbcUtil.query(templateSql);
		String templateFileId = "";
		if (l.size()>0) {
			templateFileId = l.get(0).get("fileid");
		}
		
		if (templateFileId!=null && templateFileId.length()>0) {
			try {
				Context initCtx = new InitialContext();
				DataSource ds = (DataSource) JNDIUtil.lookup(initCtx);
				Connection conn = ds.getConnection();
				Statement stmt = conn.createStatement();
				ResultSet rs = null;
				rs = stmt.executeQuery("SELECT BLOB FROM APP_BLOB WHERE FILEID ='"+templateFileId+"'");
				if(rs.next()) {
					BLOB blob = (BLOB) rs.getBlob(1);
					ins = blob.getBinaryStream();
				}
				rs.close() ;
				stmt.close() ;
				conn.close() ;
				initCtx.close() ;
				
			} catch (Exception ex) {
				ex.printStackTrace();
				return null ;
			}
		}
		return ins;
	}

	/**
	 * 设备附件移交
	 * @param type
	 * @param fileId
	 * @param fileTypes
	 * @param yjrName
	 * @return
	 * @author yanglh 2012-12-03
	 */
	@SuppressWarnings("unchecked")
	public String getJsonStrForTransToZLSByType(String type, String fileId, String fileTypes, String yjrName,String conid) {
		String fileIdSqlStr = StringUtil.transStrToIn(fileId, ",");
		List<SgccAttachList> list = this.equipmentDAO.findByWhere(SgccAttachList.class.getName(), "TRANSACTION_ID in (" + fileIdSqlStr
						+ ") and TRANSACTION_TYPE in (" + StringUtil.transStrToIn(fileTypes, ",") + ") ");
		Map<String, String> mainFileNameMap = new HashMap<String, String>();
		Map<String, String> zlTitleMap = new HashMap<String, String>();
		String inWhereStr = "conid = '"+conid+"'";
		List<EquContView>mainFile= null;
		if("zlMaterial".equals(type)){
			mainFile=this.equipmentDAO.findByWhere(EquContView.class.getName(), inWhereStr);
			for (EquContView equContView : mainFile) {
				zlTitleMap.put(equContView.getConid(), equContView.getConname()+"合同文件");
			}
		}

		StringBuffer rtnStrBuf = new StringBuffer("[");
		for (int i = 0; i < list.size(); i++) {
			SgccAttachList sgccAttachList = (SgccAttachList) list.get(i);
			List<ZlInfoBlobList> zlList1 = this.equipmentDAO.findWhereOrderBy(
					ZlInfoBlobList.class.getName(), "filelsh = '" + sgccAttachList.getFileLsh() + "'", null);
			rtnStrBuf.append("{");

			PropertyCodeDAO propertyDAO = PropertyCodeDAO.getInstence();
			String fileTypeName = propertyDAO.getCodeNameByPropertyName(
					sgccAttachList.getTransactionType(), "文件类型");
			fileTypeName = fileTypeName == null ? type : fileTypeName;
			rtnStrBuf.append("fileType:'" + sgccAttachList.getTransactionType() + "',");
			rtnStrBuf.append("fileTypeName:'" + fileTypeName + "',");
			rtnStrBuf.append("fileId:'"	+ sgccAttachList.getId().getTransactionId() + "',");
			rtnStrBuf.append("mainFileName:'"  + mainFileNameMap.get(sgccAttachList.getId().getTransactionId()) + "',");
			rtnStrBuf.append("zlTitle:'"  + zlTitleMap.get(conid) + "',");
			rtnStrBuf.append("fileLsh:'" + sgccAttachList.getFileLsh() + "',");
			rtnStrBuf.append("fileName:'" + sgccAttachList.getFileName() + "',");
			if (zlList1.size() == 1) {
				ZlInfo zlInfo = (ZlInfo) this.equipmentDAO.findById(ZlInfo.class.getName(), zlList1.get(0).getInfoid());
				String yjr = zlInfo.getYjr();
				List<ZlTree> zlTreeList = this.equipmentDAO.findByWhere(
						"com.sgepit.pmis.document.hbm.ZlTree", "indexId = '" + zlInfo.getIndexid() + "'");
				ZlTree zlTree = zlTreeList.size() == 1 ? zlTreeList.get(0) : null;
				String yjStr = "";
				if (yjr != null) {
					if (yjr.equals(yjrName)) {
						yjStr = "已被 【我】 移交到 【" + zlTree.getMc() + "】 分类下";
					} else {
						yjStr = "已被 【" + yjr + "】 移交到 【" + zlTree.getMc() + "】 分类下";
					}
				} else {
					yjStr = "已移交到 【" + zlTree.getMc() + "】 分类下";
				}
				rtnStrBuf.append("isTrans:'1',");
				rtnStrBuf.append("transState:'" + zlInfo.getBillstate() + "',");
				rtnStrBuf.append("yjStr:'" + yjStr + "'");

			} else {
				rtnStrBuf.append("isTrans:'0',");
				rtnStrBuf.append("yjStr:'未移交'");
			}
			rtnStrBuf.append("},");
		}
		if (rtnStrBuf.lastIndexOf(",") == rtnStrBuf.length() - 1){
			rtnStrBuf.deleteCharAt(rtnStrBuf.length() - 1);
		}
		rtnStrBuf.append("]");
		return rtnStrBuf.toString();
	}

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
	@SuppressWarnings("unchecked")
	public boolean equTransToZLSByType(String pid, String userdeptid, String username, String type,
			String fileLshs, String fileNames, String fileIds, String zlSortId,boolean flag) {
		try{
			String tableName = "";
			if("zlMaterial".equals(type)){
				tableName = "EQU_GOODS_OPENBOX_SUB";
			}
			String zlType = PropertyCodeDAO.getInstence().getCodeValueByPropertyName("合同", "资料类型");
			if (zlType != null) {
				zlType = "2";
			}
			String[] fileLshArr = fileLshs.split(",");
			String tableAndId = tableName+"`" + fileIds;
			String ziInfoStr = "";
			if(flag){
				Long zlTypeNum = Long.valueOf(zlType);
				SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd"); 
				ZlInfo zlinfo = new ZlInfo();
				zlinfo.setBillstate(new Long(0));
				zlinfo.setIndexid(zlSortId);
				zlinfo.setPid(pid);
				zlinfo.setMaterialname(fileNames);
				zlinfo.setResponpeople(username);
				zlinfo.setYjr(username);
				zlinfo.setStockdate(sdf.parse(sdf.format(new Date())));
				zlinfo.setOrgid(userdeptid);
				// 资料类型、份数、责任人、单位；默认值分别为：资料，1，用户自己，页
				zlinfo.setWeavecompany(username);
				zlinfo.setBook(3L);
				zlinfo.setZltype(zlTypeNum);
				zlinfo.setPortion(1L);
				zlinfo.setQuantity(1L);
				zlinfo.setRkrq(new Date());
				zlinfo.setYjTableAndId(tableAndId);
				this.equipmentDAO.insert(zlinfo);
				ziInfoStr =  zlinfo.getInfoid();
	    	}

			for (int i = 0; i < fileLshArr.length; i++) {
				String fileLsh = fileLshArr[i];
				List<SgccAttachList> list = this.equipmentDAO.findByWhere(SgccAttachList.class.getName(), "file_lsh = '" + fileLsh + "'");

				if (list.size() == 1) {
					//增加资料与大对象表的关联信息
				    if(ziInfoStr == null || ziInfoStr == ""){
				    	List<ZlInfo> getInfo = this.equipmentDAO.findByWhere(ZlInfo.class.getName(), "YJ_TABLEANDID='" + tableAndId + "' and materialname='"+fileNames+"'");
				    	ZlInfo zlInfo1 = getInfo.get(0);
				    	ziInfoStr = zlInfo1.getInfoid();
				    }
					ZlInfoBlobList blobList = new ZlInfoBlobList(ziInfoStr, "SGCC_ATTACH_BLOB", fileLsh);
					this.equipmentDAO.insert(blobList);
				}
			}
			return true;
		}catch(Exception ex){
			ex.printStackTrace();
			return false;
		}
	}

	@SuppressWarnings("unchecked")
	public boolean cancelEquTrans(String filelsh, String fileIds, String zlTitle) {
		try {
			List<ZlInfo> getInfo = this.equipmentDAO.findByWhere(
					ZlInfo.class.getName(), "YJ_TABLEANDID like '%" + fileIds + "' and materialname='" + zlTitle + "'");
			ZlInfo getZlInfo = getInfo.get(0);
			List<ZlInfoBlobList> zlInfoBlobList = this.equipmentDAO.findByWhere(ZlInfoBlobList.class.getName(),
					"infoid='" + getZlInfo.getInfoid() + "' and file_lsh='" + filelsh + "'");
			if (zlInfoBlobList.size() > 0) {
				this.equipmentDAO.deleteAll(zlInfoBlobList);
			}
			List<SgccAttachList> sgccAttachList = this.equipmentDAO.findByWhere(SgccAttachList.class.getName(),
							"transaction_id='" + getZlInfo.getInfoid() + "' and file_lsh='" + filelsh + "'");
			if (sgccAttachList.size() > 0) {
				this.equipmentDAO.deleteAll(sgccAttachList);
			}

			List<ZlInfoBlobList> list1 = this.equipmentDAO.findByWhere(ZlInfoBlobList.class.getName(),
					"infoid='" + getZlInfo.getInfoid() + "'");
			List<SgccAttachList> list2 = this.equipmentDAO.findByWhere(SgccAttachList.class.getName(),
					"transaction_id='" + getZlInfo.getInfoid() + "'");
			if (list1.size() == 0 && list2.size() == 0) {
				this.equipmentDAO.deleteAll(getInfo);
			}
			return true;
		} catch (Exception ex) {
			ex.printStackTrace();
			return false;
		}
	} 

	/**
	 * 专用工具借用管理细表
	 * @param EquSpecialToolsDetail
	 * @author shangtw 2013-4-11
	 */
	public String initEquSpecialToolsDetail(EquSpecialToolsDetail equSpecialToolsDetail){	
		String flag="1";
		try {
			this.equipmentDAO.insert(equSpecialToolsDetail);	
		} catch (RuntimeException e) {
			flag="2";
		}
		return flag;
	}

	/**
	 * 根据专用工具主表id删除专用工具细表
	 * @param masteruids
	 * @author shangtw 2013-4-12
	 */
	public String deleteEquSpecialToolsDetailByMaster(String masteruids){
		String flag="1";
		try {
			JdbcUtil.execute("delete from EQU_SPECIAL_TOOLS_DETAIL where masteruids='"+masteruids+"'");
		} catch (RuntimeException e) {
			flag="2";
		}
		return flag;
		
	}

	/**
	 * 粘贴设备到货中的到货单明细
	 * @param parts 从页面传回的到货单明细数组对象
	 * @return	'1'	添加成功
	 * @author pengy 2013-05-03
	 */
	public String pasteEquArrivalSubPart(EquGoodsArrivalSub[] parts){
		for(int i = 0;i < parts.length; i++){
			this.equipmentDAO.insert(parts[i]);
		}
		return "1";
	}

	/**
	 * 通过选择的设备合同树子节点，查找其所属的三级节点，即01主设备,02备用备品,03专工具
	 * @param treeid	选择的设备合同树的treeid
	 * @param conid		合同id
	 * @return		三级节点的设备类型1,2,3	
	 */
	public String findEquType(String treeid,String conid){
		String parentid ="";
		String hql = "treeid = '"+treeid+"' and conid = '"+conid+"'";
		List<EquTypeTree> tree = this.equipmentDAO.findByWhere(EquTypeTree.class.getName(), hql);
		if(tree != null && tree.size()>0){
			parentid = tree.get(0).getParentid();
			if(parentid.equals("01") || parentid.equals("02") || parentid.equals("03")){
				return parentid.substring(1);
			}else{
				return findEquType(parentid,conid);
			}
		}else{
			return "";
		}
	}

	@Override
	public String importData(String pid, String uids, String beanName, FileItem fileItem) {
		try {
			Workbook wb = null;
			try {
				// 导入*.xls文件
				InputStream is = fileItem.getInputStream();
				wb = new HSSFWorkbook(is);
				is.close();
			} catch (Exception e) {
				// 导入*.xlsx文件
				InputStream is = fileItem.getInputStream();
				wb = new XSSFWorkbook(is);
				is.close();
			}
			boolean impBool = false;
			if (wb == null) {
				return "{success:false,msg:[{result:'上传失败,没有Excel文档！'}]}";
			} else {
				Sheet sheet = wb.getSheetAt(0);
				// 判断是否是对于的excel表
				Row row2 = sheet.getRow(1);
				Cell cellA2 = row2.getCell(0);
				//Excel的A2单元格包含“importData”，则为规定的模板
				if (!cellA2.getStringCellValue().equals("importData"))
					return "{success:false,msg:[{result:'模板上传错误！请下载模板填写好数据再上传！'}]}";
				Row row = null;
				Cell cell = null;
				//一个map为一行数据，map存放列名（excel中第二行隐藏的列名，列名和实体属性名对应）和值
				List<Map<String, String>> list = new ArrayList<Map<String,String>>();
				// 得到excel的总记录条数
				int totalRow = sheet.getLastRowNum();
				Row columnRow = null;// 列配置行，单元格的值与bean的属性对应
				for (int i = 0; i <= totalRow; i++) {
					if (i == 0 || i == 1 || i == 2) {
						if (i == 1)	columnRow = sheet.getRow(i);
						continue;
					}else{
						row = sheet.getRow(i);
						Map<String, String> map = new HashMap<String, String>();
						for (int j = 0; j < columnRow.getPhysicalNumberOfCells(); j++) {
							if (j == 0 || j == 1){
								continue;
							}else{
								String cellValue = null;
								cell = row.getCell(j);
								if (cell != null) {
									cell.setCellType(1);
									cellValue = cell.getStringCellValue();
								}
								//为null转为空字符串存放，避免后面对null进行toString()操作
								map.put(columnRow.getCell(j).getStringCellValue(),
										cellValue==null?"":cellValue);
							}
						}
						list.add(map);
					}
				}
				
				if(beanName.equals(EquGoodsArrivalSub.class.getName())){
					impBool = this.importDataByEquGoodsArrivalSub(uids, list);
				}else if(beanName.equals(EquGoodsOpenboxSubPart.class.getName())){
					impBool = this.importDataByEquGoodsOpenboxSubPart(uids, list);
				}
				
				if(impBool)
					return "{success:true,msg:[{result:'上传成功！'}]}";
				else
					return "{success:false,msg:[{result:'上传失败'}]}";
			}
		} catch (Exception e) {
			e.printStackTrace();
			return "{success:false,msg:[{result:'上传失败'}]}";
		}
	}

	@SuppressWarnings("unchecked")
	public boolean importDataByEquGoodsArrivalSub(String uids, List<Map<String, String>> list) {
		EquGoodsArrival arrival = (EquGoodsArrival) this.equipmentDAO.findById(
				EquGoodsArrival.class.getName(), uids);
		try {
			String boxType = "";
			for (int i = 0; i < list.size(); i++) {
				Map<String, String> map = list.get(i);
				// 新增数据生成主键
				String getID = UUID.randomUUID().toString().replace("-", "");
				
				EquGoodsArrivalSub sub = new EquGoodsArrivalSub();
				sub.setUids(getID);
				sub.setPid(arrival.getPid());
				sub.setArrivalId(arrival.getUids());
				sub.setArrivalNo(arrival.getDhNo());
					String value = map.get("boxType").toString();
				   	if(value.equals("箱件")){
				   		boxType = "01";
				   	}else if(value.equals("裸件")){
				   		boxType = "02";
				   	}
				sub.setBoxType(boxType);
				//导入模板中“机组号”、“存放库位”、“包装方式”改为下拉框选择 pengy 2013-12-24
//				sub.setJzNo(map.get("jzNo"));
				List<String> jzNos = this.equipmentDAO.getDataAutoCloseSes("SELECT C.PROPERTY_CODE FROM PROPERTY_CODE C WHERE C.PROPERTY_NAME ='" +
						map.get("jzNo") + "' AND C.TYPE_NAME=(SELECT T.UIDS FROM PROPERTY_TYPE T WHERE T.TYPE_NAME = '机组号')");
				sub.setJzNo(jzNos != null && jzNos.size() == 1 ? jzNos.get(0) : "");
				sub.setBoxNo(map.get("boxNo"));
				sub.setBoxName(map.get("boxName"));
				sub.setGgxh(map.get("ggxh"));
				sub.setGraphNo(map.get("graphNo"));
				sub.setUnit(map.get("unit"));
				sub.setMustNum(Double.valueOf(map.get("mustNum").equals("")?"0":map.get("mustNum")));
				sub.setRealNum(Double.valueOf(map.get("realNum").equals("")?"0":map.get("realNum")));
				sub.setWeight(Double.valueOf(map.get("weight").equals("")?"0":map.get("weight")));
//				sub.setPackType(map.get("packType"));
				List<String> packTypes = this.equipmentDAO.getDataAutoCloseSes("SELECT S.PUUID FROM EQU_PACK_STYLE S WHERE S.PACKSTYLE='"+map.get("packType")+"'");
				sub.setPackType(packTypes != null && packTypes.size() == 1 ? packTypes.get(0) : "");
//				sub.setStorage(map.get("storage"));
				List<String> storages = this.equipmentDAO.getDataAutoCloseSes("SELECT W.UIDS FROM EQU_WAREHOUSE W WHERE W.DETAILED='"+map.get("storage")+"'");
				sub.setStorage(storages != null && storages.size() == 1 ? storages.get(0) : "");
				sub.setException(Integer.parseInt(map.get("exception").equals("")?"0":map.get("exception")));
				sub.setExceptionDesc(map.get("exceptionDesc"));
				sub.setRemark(map.get("remark"));
				this.equipmentDAO.insert(sub);
			}
			return true;
			
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	
	@SuppressWarnings("unchecked")
	public boolean importDataByEquGoodsOpenboxSubPart(String uids, List<Map<String, String>> list) {
		EquGoodsOpenboxSub sub = (EquGoodsOpenboxSub) this.equipmentDAO.findById(
				EquGoodsOpenboxSub.class.getName(), uids);
		EquGoodsOpenbox box = (EquGoodsOpenbox) this.equipmentDAO.findById(
				EquGoodsOpenbox.class.getName(), sub.getOpenboxId());
		try {
			for (int i = 0; i < list.size(); i++) {
				Map<String, String> map = list.get(i);
				// 新增数据生成主键
				String getID = UUID.randomUUID().toString().replace("-", "");
				
				EquGoodsOpenboxSubPart part = new EquGoodsOpenboxSubPart();
				part.setUids(getID);
				part.setOpenboxSubId(sub.getUids());
				part.setEquType(sub.getEquType());
				part.setTreeuids(sub.getTreeuids());
				part.setOpenboxId(box.getUids());
				part.setOpenboxNo(box.getOpenNo());
				part.setPid(box.getPid());
				part.setStorage(sub.getStorage());
				//导入模板中“设备合同分类树”改为下拉框选择 shuz 2014-3-7
//				List<String> treeUids = this.equipmentDAO.getDataAutoCloseSes("select uuid from equ_type_tree t " +
//							"where t.treename = " +
//								"(SELECT distinct C.PROPERTY_CODE FROM PROPERTY_CODE C WHERE C.PROPERTY_NAME='"+map.get("treeuids")+"')");
				List<String> treeUids = this.equipmentDAO.getDataAutoCloseSes("select t.uuid from equ_type_tree t,PROPERTY_CODE c " +
						" where t.treename = c.property_code and c.property_name ='"+map.get("treeuids")+"' and conid='"+box.getConid()+"'");
				part.setTreeuids(treeUids !=null&&treeUids.size()>0 ? treeUids.get(0):"");
				//导入模板中“设备类型”改为下拉框选择 shuz 2014-3-7
				List<String> equTypes = this.equipmentDAO.getDataAutoCloseSes("SELECT C.PROPERTY_CODE FROM PROPERTY_CODE C WHERE C.PROPERTY_NAME ='" +
						map.get("equType") + "' AND C.TYPE_NAME=(SELECT T.UIDS FROM PROPERTY_TYPE T WHERE T.TYPE_NAME = '设备合同树分类')");
				part.setEquType(equTypes !=null && equTypes.size()==1 ? equTypes.get(0) : "");
				//导入模板中“机组号”改为下拉框选择 pengy 2013-12-25
//				part.setJzNo(map.get("jzNo"));
				List<String> jzNos = this.equipmentDAO.getDataAutoCloseSes("SELECT C.PROPERTY_CODE FROM PROPERTY_CODE C WHERE C.PROPERTY_NAME ='" +
						map.get("jzNo") + "' AND C.TYPE_NAME=(SELECT T.UIDS FROM PROPERTY_TYPE T WHERE T.TYPE_NAME = '机组号')");
				part.setJzNo(jzNos != null && jzNos.size() == 1 ? jzNos.get(0) : "");
				part.setBoxNo(map.get("boxNo"));
				part.setEquPartName(map.get("equPartName"));
				part.setGgxh(map.get("ggxh"));
				part.setGraphNo(map.get("graphNo"));
				part.setUnit(map.get("unit"));
				part.setBoxinNum(Double.valueOf(map.get("boxinNum").equals("")?"0":map.get("boxinNum")));
				part.setWeight(Double.valueOf(map.get("weight").equals("")?"0":map.get("weight")));
				this.equipmentDAO.insert(part);
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	
	public String importBodyData(String pid, String selectUuid,String selectConid,String userDept,String bean,FileItem fileItem){

		try {
			Workbook wb = null;
			try {
				// 导入*.xls文件
				InputStream is = fileItem.getInputStream();
				wb = new HSSFWorkbook(is);
				is.close();
			} catch (Exception e) {
				// 导入*.xlsx文件
				InputStream is = fileItem.getInputStream();
				wb = new XSSFWorkbook(is);
				is.close();
			}
			boolean impBool = false;
			if (wb == null) {
				return "{success:false,msg:[{result:'上传失败,没有Excel文档！'}]}";
			} else {
				Sheet sheet = wb.getSheetAt(0);
				// 判断是否是对于的excel表
				Row row2 = sheet.getRow(2);
				Cell cellA2 = row2.getCell(0);
				//Excel的A2单元格包含“importData”，则为规定的模板
				if (!cellA2.getStringCellValue().equals("importData"))
					return "{success:false,msg:[{result:'模板上传错误！请下载模板填写好数据再上传！'}]}";
				Row row = null;
				Cell cell = null;
				//一个map为一行数据，map存放列名（excel中第二行隐藏的列名，列名和实体属性名对应）和值
				List<Map<String, String>> list = new ArrayList<Map<String,String>>();
				// 得到excel的总记录条数
				int totalRow = sheet.getLastRowNum();
				Row columnRow = null;// 列配置行，单元格的值与bean的属性对应
				for (int i = 0; i <= totalRow; i++) {
					if (i == 0 || i == 1 || i == 2) {
						if (i == 2)	columnRow = sheet.getRow(i);
						continue;
					}else{
						row = sheet.getRow(i);
						Map<String, String> map = new HashMap<String, String>();
						for (int j = 0; j < columnRow.getPhysicalNumberOfCells(); j++) {
							if (j == 0){
								continue;
							}else{
								String cellValue = null;
								cell = row.getCell(j);
								if (cell != null) {
									cell.setCellType(1);
									cellValue = cell.getStringCellValue();
								}
								//为null转为空字符串存放，避免后面对null进行toString()操作
								map.put(columnRow.getCell(j).getStringCellValue(),
										cellValue==null?"":cellValue);
							}
						}
						list.add(map);
					}
				}
				
				if(bean.equals(EquGoodsBodys.class.getName())){
					impBool = this.importDataByEquGoodsBodys(pid,selectUuid,selectConid,userDept,list);
				}
				
				if(impBool)
					return "{success:true,msg:[{result:'上传成功！'}]}";
				else
					return "{success:false,msg:[{result:'上传失败'}]}";
			}
		} catch (Exception e) {
			e.printStackTrace();
			return "{success:false,msg:[{result:'上传失败'}]}";
		}
	
	}
	
	public boolean importDataByEquGoodsBodys(String pid,String selectUuid,String selectConid,String userDept,List<Map<String, String>> list) {
		try {
			String conmoneyno = "";//财务合同编码
			ConOve o = (ConOve)this.equipmentDAO.findById(ConOve.class.getName(), selectConid);
			if(o !=null){
				conmoneyno = o.getConno();
			}
			for (int i = 0; i < list.size(); i++) {
				Map<String, String> map = list.get(i);
				EquGoodsBodys b = new EquGoodsBodys();
				/**自动生成设备编号**/
				String getSql = "select equ_no from Equ_Goods_bodys t where conid='"+selectConid+"' and treeUids ='"+selectUuid+
                "' and equ_no=(select max(equ_no)  from Equ_Goods_bodys t where conid = '"+selectConid+"' and treeUids = '"+selectUuid+"')";
				List noList = this.equipmentDAO.getDataAutoCloseSes(getSql);
				String newRkNo = "";
				if(noList !=null && noList.size()>0){
					newRkNo = noList.get(0).toString().substring(0, noList.get(0).toString().length()-4);
				}
				if(newRkNo == null || newRkNo.equals("") ){
				//获取单号前缀。前缀获取说明：在属性代码中配置“单号前缀”
				String prefix = "";
				String sql = "select c.property_name from PROPERTY_CODE c " +
					" where c.TYPE_NAME = (select t.uids from Property_Type t where t.TYPE_NAME = '单号前缀')" +
					" and c.property_code = '"+userDept+"' ";
				List preList = this.equipmentDAO.getDataAutoCloseSes(sql);
				if(preList !=null &&  preList.size()>0){
					prefix = preList.get(0).toString();
				}
				 newRkNo = conmoneyno+"-";
				}
				newRkNo = getEquNewDhNo(pid,newRkNo,"equ_no","EQU_GOODS_BODYS",null);
				b.setConid(selectConid);
				b.setTreeUids(selectUuid);
				b.setPid(pid);
				b.setEquNo(newRkNo);
				b.setCreateDate(new Date());
				System.out.println(">>>>"+map.get("equName"));
				b.setEquName(map.get("equName")==null?"":map.get("equName"));
				b.setGgxh(map.get("ggxh")==null?"":map.get("ggxh"));
				Double totalMoney = Double.parseDouble(map.get("totalMoney")==null?"0":map.get("totalMoney").toString());
				b.setTotalMoney(totalMoney);
				this.equipmentDAO.insert(b);
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
//从津能移植主体设备维护到国锦相关方法
    /**
     * @param uids
     * @param pid
     * 暂估入库是否完结做判断删除主表和字表的相关内容
     */	
	@SuppressWarnings("unchecked")
	public String delEquRkGoodsStoreinEstimate(String uids, String flag, String pid) {
		List<EquGoodsStoreinEstimate> delList = this.equipmentDAO.findByWhere(
				EquGoodsStoreinEstimate.class.getName(), "uids='" + uids + "' and pid='" + pid + "'");
		List<EquGoodsStoreinEstimateSub> list = this.equipmentDAO.findByWhere(EquGoodsStoreinEstimateSub.class.getName(),
				"sbrk_uids='" + uids + "' and  pid='" + pid + "' order by uids");
		EquGoodsStoreinEstimate equGoodsStorein = new EquGoodsStoreinEstimate();
		EquGoodsStoreinEstimateSub equGoodsStoreinSub = new EquGoodsStoreinEstimateSub();
		if (list.size() > 0) {
			for (int i = 0; i < list.size(); i++) {
				equGoodsStoreinSub = (EquGoodsStoreinEstimateSub) list.get(i);
				if ("1".equals(flag)) {
					List<EquGoodsOpenboxExceView> delExceUUid = this.equipmentDAO.findByWhere(EquGoodsOpenboxExceView.class.getName(),
							"uids='" + equGoodsStoreinSub.getBoxSubId() + "'and pid='" + pid + "'");
					EquGoodsOpenboxExceView equGoodsOpenboxExceView = (EquGoodsOpenboxExceView) delExceUUid
							.get(0);
					String updataExceIsStoreIn = "update equ_goods_openbox_exce set is_storein='0' where uids='"
							+ equGoodsOpenboxExceView.getUids() + "'";
					
					this.equipmentDAO.updateBySQL(updataExceIsStoreIn);
				}
				//删除记录后修改主体设备删除修改权限控制
				String updateSql = "update Equ_Goods_Bodys set del_or_update='1' where equ_no not in (" +
					"select stockno from (select stockno from EQU_GOODS_STOREIN_ESTIMATE_SUB t where  t.uids<>'"+
					equGoodsStoreinSub.getUids()+"' union select stockno from EQU_GOODS_STOREIN_SUB where sbrk_uids" +
					" in (select uids from EQU_GOODS_STOREIN t where t.data_type='EQUBODY'))) and equ_name='"
					+equGoodsStoreinSub.getWarehouseName()+"' and ggxh='"+equGoodsStoreinSub.getGgxh()+"'";
                this.equipmentDAO.updateBySQL(updateSql);
				this.equipmentDAO.delete(equGoodsStoreinSub);
			}
		}
		if (delList.size() > 0) {
			List<SgccAttachList> listSAL = this.equipmentDAO.findByWhere(
					SgccAttachList.class.getName(), "transaction_id ='" + uids + "'");
			if (listSAL.size() > 0) {
				for (int i = 0; i < listSAL.size(); i++) {
					SgccAttachList sal = listSAL.get(i);
					SgccAttachBlob sab = (SgccAttachBlob) this.equipmentDAO.findById(SgccAttachBlob.class.getName(), sal.getFileLsh());
					this.equipmentDAO.delete(sab);
					this.equipmentDAO.delete(sal);
				}
			}
		}
		equGoodsStorein = (EquGoodsStoreinEstimate) delList.get(0);
		if ("0".equals(flag) && equGoodsStorein.getOpenBoxId() != null) {
			String[] noArr = equGoodsStorein.getOpenBoxId().split(",");
			for (int i = 0; i < noArr.length; i++) {
				String updataIsStorein = "update equ_goods_openbox set is_storein ='0' where uids='"
						+ noArr[i] + "' and pid='" + pid + "'";
				this.equipmentDAO.updateBySQL(updataIsStorein);
			}
		}
		this.equipmentDAO.delete(equGoodsStorein);
		return "success";
	}
    /**
     * 暂估入库单完结
     * @param uids
     * @param exceFlag
     * @param pid
     * @author yanglh 2012-12-26
     */
	@SuppressWarnings("unchecked")
	public int judgmentFinishedEstimate(String uids, String exceFlag, String pid,String judement,String makeType) {
		String updateSql = "";
		List<EquGoodsStoreinEstimateSub> list = this.equipmentDAO.findByWhere(
				EquGoodsStoreinEstimateSub.class.getName(), "sbrk_uids='" + uids + "' and pid='" + pid + "'");
		if (list.size() == 0) {
			return 3;
		} else if (list.size() > 0) {
			int flag = 0;
			for (int i = 0; i < list.size(); i++) {
				EquGoodsStoreinEstimateSub equGoodsStoreinSub = new EquGoodsStoreinEstimateSub();
				equGoodsStoreinSub = (EquGoodsStoreinEstimateSub) list.get(i);

				if ("".equals(equGoodsStoreinSub.getInWarehouseNo())
						|| equGoodsStoreinSub.getInWarehouseNo() == null
						|| equGoodsStoreinSub.getInWarehouseNo() == 0) {
					flag = 2;
					break;
				}
				// else if ("".equals(equGoodsStoreinSub.getIntoMoney())
				// || equGoodsStoreinSub.getIntoMoney() == null
				// || equGoodsStoreinSub.getIntoMoney() == 0) {
				// flag = 2;
				// break;
				// } else if ("".equals(equGoodsStoreinSub.getTotalMoney())
				// || equGoodsStoreinSub.getTotalMoney() == null
				// || equGoodsStoreinSub.getTotalMoney() == 0) {
				// flag = 2;
				// break;
				// }
			}
			if (flag == 2) {
				return 2;
			} else {
				// 对完结的数据存入设备库存里面去
				String resule = this.finishEquZGRkGoodsStorein(uids, pid,judement,makeType);
				if ("success".equals(resule)) {
					updateSql = "update equ_goods_storein_estimate t set t.finished='1' where t.uids='"
							+ uids + "' and t.pid='" + pid + "'";
					JdbcUtil.execute(updateSql);
					return 0;
				} else {
					return 1;
				}
			}
		}
		return 1;
	}
	
	/**
	 * 暂估入库完结操作
	 * 
	 * @param uids
	 * @param exceFlag
	 * @param pid
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String finishEquZGRkGoodsStorein(String uids, String pid,String judement,String makeType) {
		List<EquGoodsStoreinEstimate> list = this.equipmentDAO.findByWhere(EquGoodsStoreinEstimate.class.getName(),
				"uids='" + uids + "' and pid='" + pid + "'");
		EquGoodsStoreinEstimate equGoodsStorein = list.get(0);
		List<EquGoodsStoreinEstimateSub> getSubList = this.equipmentDAO.findByWhere(EquGoodsStoreinEstimateSub.class.getName(),
				"sbrk_uids='" + uids + "' and pid='" + pid + "' order by uids");
		for (int i = 0; i < getSubList.size(); i++) {
			EquGoodsStock equGoodsStock = new EquGoodsStock();
			EquGoodsStoreinEstimateSub obj = (EquGoodsStoreinEstimateSub) getSubList.get(i);
//			whereSql = "conid='" + equGoodsStorein.getConid()
//					+ "' and treeuids='" + equGoodsStorein.getTreeUids()
//					+ "' and equPartName='" + obj.getWarehouseName()
//					+"' and ggxh='"+obj.getGgxh()+"' and unit='"+obj.getUnit()
//					+"'  and equType='"+obj.getWarehouseType()
//					+ "' and pid='" + pid + "' and makeType='"+makeType+"'";
//			List listKC = this.equipmentDAO.findByWhere(EquGoodsStock.class
//					.getName(), whereSql);
//			if (listKC.size() == 0 || listKC == null) {
				equGoodsStock.setPid(pid);
				equGoodsStock.setConid(equGoodsStorein.getConid());
				equGoodsStock.setTreeuids(equGoodsStorein.getTreeUids());
				equGoodsStock.setBoxNo(obj.getBoxNo());
				equGoodsStock.setEquType(obj.getWarehouseType());
				equGoodsStock.setEquPartName(obj.getWarehouseName());
				equGoodsStock.setGgxh(obj.getGgxh());
				equGoodsStock.setGraphNo(obj.getGraphNo());
				equGoodsStock.setUnit(obj.getUnit());
				equGoodsStock.setWeight(obj.getWeight());
				equGoodsStock.setStorage(obj.getEquno());
				equGoodsStock.setStockNum(Double.valueOf(obj.getInWarehouseNo()));
				equGoodsStock.setJudgment(judement);
				equGoodsStock.setDataType(equGoodsStorein.getDataType());
				equGoodsStock.setStorage(obj.getEquno());
				equGoodsStock.setMakeType(makeType);
				equGoodsStock.setStockNo(obj.getStockno());
				equGoodsStock.setIntoMoney(obj.getIntoMoney());
				//统计库存金额：库存金额=该物资所有完结入库单的入库金额合计-该物资所有完结出库单的出库金额合计
				Double  getIntoTotalMoney = 0.00;
				Double  getOuntTotalMoney = 0.00;
				String where = "sbrkUids in (select uids from EquGoodsStoreinEstimate where finished='1' " +
						" and dataType='EQUBODY') and warehouseName='"+obj.getWarehouseName()+"' and warehouseType='"+
						obj.getWarehouseType()+"' and stockno='"+obj.getStockno()+"' and ggxh='"+obj.getGgxh()+"'";
				List<EquGoodsStoreinEstimateSub> list1 = this.equipmentDAO.findByWhere(EquGoodsStoreinEstimateSub.class.getName(), where);
			    if(list1.size()>0){
					for(int k=0;k<list1.size();k++){
						EquGoodsStoreinEstimateSub sub = list1.get(k);
				    	getIntoTotalMoney += sub.getTotalMoney(); 
				    }
			    }
			    String where2 = "outId in (select uids from EquGoodsOutEstimate where finished='1' and dataType='EQUBODY')" +
			    		"  and equPartName='"+obj.getWarehouseName()+"' and equType='"+obj.getWarehouseType()+"' and boxNo='"+obj.getStockno()+"' and ggxh='"+obj.getGgxh()+"'";
			    List<EquGoodsOutEstimateSub> list2 = this.equipmentDAO.findByWhere(EquGoodsOutEstimateSub.class.getName(), where2);
 				if(list2.size()>0){
 					for(int j=0;j<list2.size();j++){
 						EquGoodsOutEstimateSub outSub = list2.get(j);
 						getOuntTotalMoney += outSub.getAmount();
 					}
 				}
 				equGoodsStock.setKcMoney(getIntoTotalMoney+obj.getTotalMoney()-getOuntTotalMoney);
				this.equipmentDAO.insert(equGoodsStock);
//			} else {
//				equGoodsStock = (EquGoodsStock) listKC.get(0);
//				equGoodsStock.setStockNum(equGoodsStock.getStockNum()
//						+ obj.getInWarehouseNo());
//				this.equipmentDAO.saveOrUpdate(equGoodsStock);
//			}
		}
		return "success";
	}
	
	/**
     * 确认冲回入库按钮操作功能实现
     * @param uids
     * @param newNo
     * @return
     */	
	public String resetGoodsStoreinBack(String uids, String newNo,String userDeptid,String userId ) {
		EquGoodsStoreinEstimate egses = (EquGoodsStoreinEstimate) this.equipmentDAO.findById(EquGoodsStoreinEstimate.class.getName(), uids);
		if (!egses.equals("")) {
			Date date = new Date();
			EquGoodsStoreinBack egsb = new EquGoodsStoreinBack();
			egsb.setPid(egses.getPid());
			egsb.setConid(egses.getConid());
			egsb.setFinished(Byte.valueOf("1"));
			egsb.setTreeUids(egses.getTreeUids());
			egsb.setWarehouseNo(egses.getWarehouseNo());
			egsb.setWarehouseNoNo(newNo);
			egsb.setWarehouseDate(date);
			egsb.setNoticeNo(egses.getNoticeNo());
			egsb.setWarehouseMan(egses.getWarehouseMan());
			egsb.setMakeMan(egses.getMakeMan());
			egsb.setAbnormalOrNo(egses.getAbnormalOrNo());
			egsb.setOpenBoxId(egses.getOpenBoxId());
			egsb.setSupplyunit(egses.getSupplyunit());
			egsb.setInvoiceno(egses.getInvoiceno());
			egsb.setFileid(egses.getFileid());
			egsb.setEquid(egses.getEquid());
			egsb.setRemark(egses.getRemark());
			egsb.setCreateMan(userId);
			egsb.setCreateUnit(userDeptid);
			egsb.setDataType(egses.getDataType());
			egsb.setWarehouseInType("冲回入库");
			this.equipmentDAO.insert(egsb);
			List<EquGoodsStoreinEstimateSub> list = this.equipmentDAO.findByWhere(
					EquGoodsStoreinEstimateSub.class.getName(), "sbrk_uids='" + uids + "'");
			if (list.size() > 0) {
				for (int i = 0; i < list.size(); i++) {
					EquGoodsStoreinEstimateSub egss = list.get(i);
					EquGoodsStoreinBackSub egsbs = new EquGoodsStoreinBackSub();
					egsbs.setSbrkUids(egsb.getUids());
					egsbs.setGgxh(egss.getGgxh());
					egsbs.setMemo(egss.getMemo());
					egsbs.setPid(egss.getPid());
					egsbs.setBoxNo(egss.getBoxNo());
					egsbs.setWarehouseType(egss.getWarehouseType());
					egsbs.setWarehouseName(egss.getWarehouseName());
					egsbs.setGraphNo(egss.getGgxh());
					egsbs.setUnit(egss.getUnit());
					egsbs.setWarehouseNum(egss.getWarehouseNum());
					egsbs.setInWarehouseNo(-egss.getInWarehouseNo());
					egsbs.setIntoMoney(egss.getIntoMoney());
					egsbs.setTotalMoney(-egss.getTotalMoney());
					egsbs.setEquno(egss.getEquno());
					egsbs.setBoxSubId(egss.getBoxSubId());
					egsbs.setWeight(egss.getWeight());
					egsbs.setStockno(egss.getStockno());
					egsbs.setTaxes(-egss.getTaxes());
					egsbs.setTotalnum(-egss.getTotalnum());
					egsbs.setUnitPrice(egss.getUnitPrice());
					egsbs.setAmountMoney(egss.getAmountMoney());
					egsbs.setFreightMoney(egss.getFreightMoney());
					egsbs.setInsuranceMoney(egss.getInsuranceMoney());
					egsbs.setAntherMoney(egss.getAntherMoney());
					egsbs.setAmountTax(egss.getAmountTax());
					egsbs.setFreightTax(egss.getFreightTax());
					egsbs.setInsuranceTax(egss.getInsuranceTax());
					egsbs.setAntherTax(egss.getAntherTax());
					this.equipmentDAO.insert(egsbs);
				}
			}
			return "success";
		}
		return null;
	}
	/**
	 * 删除冲回入库数据
	 * 
	 * @param uids
	 * @param flag
	 * @param pid
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String delEquRkGoodsStoreinBack(String uids, String flag, String pid) {
		List<EquGoodsStoreinBack> list = this.equipmentDAO.findByWhere(
				EquGoodsStoreinBack.class.getName(), "uids='" + uids + "'");
		if (list.size() > 0) {
			List<EquGoodsStoreinBackSub> list1 = this.equipmentDAO.findByWhere(
					EquGoodsStoreinBackSub.class.getName(), "sbrk_uids='" + uids + "'");
			if (list1.size() > 0) {
				for (int i = 0; i < list1.size(); i++) {
					EquGoodsStoreinBackSub egsbs = list1.get(i);
					this.equipmentDAO.delete(egsbs);
				}
			}
			this.equipmentDAO.deleteAll(list);
			List<SgccAttachList> listSAL = this.equipmentDAO.findByWhere(
					SgccAttachList.class.getName(), "transaction_id ='" + uids + "'");
			if (listSAL.size() > 0) {
				for (int i = 0; i < listSAL.size(); i++) {
					SgccAttachList sal = listSAL.get(i);
					SgccAttachBlob sab = (SgccAttachBlob) this.equipmentDAO.findById(SgccAttachBlob.class.getName(), sal.getFileLsh());
					this.equipmentDAO.delete(sab);
					this.equipmentDAO.delete(sal);
				}
			}
			return "success";
		} else {
			return "failure";
		}

	}

	/**
	 * 冲回入库完结操作
	 * @param uids
	 * @param exceFlag
	 * @param pid
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public int judgmentBackFinished(String uids, String exceFlag, String pid,String judgment,String makeType) {
		String updateSql = "";
		List<EquGoodsStoreinBackSub> list = this.equipmentDAO.findByWhere(EquGoodsStoreinBackSub.class.getName(),
				"sbrk_uids='" + uids + "' and pid='" + pid + "'");
		if (list.size() == 0) {
			return 3;
		} else if (list.size() > 0) {
			int flag = 0;
			for (int i = 0; i < list.size(); i++) {
				EquGoodsStoreinBackSub equGoodsStoreinSub = new EquGoodsStoreinBackSub();
				equGoodsStoreinSub = (EquGoodsStoreinBackSub) list.get(i);

				if ("".equals(equGoodsStoreinSub.getInWarehouseNo())
						|| equGoodsStoreinSub.getInWarehouseNo() == null
						|| equGoodsStoreinSub.getInWarehouseNo() == 0) {
					flag = 2;
					break;
				} else if ("".equals(equGoodsStoreinSub.getIntoMoney())
						|| equGoodsStoreinSub.getIntoMoney() == null
						|| equGoodsStoreinSub.getIntoMoney() == 0) {
					flag = 2;
					break;
				} else if ("".equals(equGoodsStoreinSub.getTotalMoney())
						|| equGoodsStoreinSub.getTotalMoney() == null
						|| equGoodsStoreinSub.getTotalMoney() == 0) {
					flag = 2;
					break;
					// }else if("".equals(equGoodsStoreinSub.getEquno()) ||
					// equGoodsStoreinSub.getEquno() == null ||
					// "0".equals(equGoodsStoreinSub.getEquno())){
					// flag = 2;
					// break;
				}
			}
			if (flag == 2) {
				return 2;
			} else {
				// 对完结的数据存入设备库存里面去
				String resule = this.finishEquBackRkGoodsStorein(uids, pid,judgment,makeType);
				if ("success".equals(resule)) {
					updateSql = "update equ_goods_storein_back t set t.finished='1' where t.uids='"
							+ uids + "' and t.pid='" + pid + "'";
					JdbcUtil.execute(updateSql);
					return 0;
				} else {
					return 1;
				}
			}
		}
		return 1;
	}

    /**
     * 冲回入库完结操作入库存
     * @param uids
     * @param exceFlag
     * @param pid
     * @return
     */	
	@SuppressWarnings("unchecked")
	public String finishEquBackRkGoodsStorein(String uids, String pid,String judgment,String makeType) {
		String whereSql = "";
		List<EquGoodsStoreinBack> list = this.equipmentDAO.findByWhere(EquGoodsStoreinBack.class.getName(),
				"uids='" + uids + "' and pid='" + pid + "'");
		EquGoodsStoreinBack equGoodsStorein = (EquGoodsStoreinBack) list.get(0);
		List<EquGoodsStoreinBackSub> getSubList = this.equipmentDAO.findByWhere(EquGoodsStoreinBackSub.class.getName(),
				"sbrk_uids='" + uids + "' and pid='" + pid + "' order by uids");
		for (int i = 0; i < getSubList.size(); i++) {
			EquGoodsStock equGoodsStock = new EquGoodsStock();
			EquGoodsStoreinBackSub obj = (EquGoodsStoreinBackSub) getSubList.get(i);
			whereSql = "conid='" + equGoodsStorein.getConid()
						+ "' and treeuids='" + equGoodsStorein.getTreeUids()
						+ "' and equPartName='" + obj.getWarehouseName()
						+ "' and ggxh='"+obj.getGgxh()+"' and unit='"+obj.getUnit()
						+ "' and equType='"+obj.getWarehouseType()
						+ "' and pid='" + pid + "' and makeType='"+makeType
						+ "' and stockNo='"+obj.getStockno()+"'";
			List<EquGoodsStock> listKC = this.equipmentDAO.findByWhere(EquGoodsStock.class.getName(), whereSql);
			if (listKC.size() == 0 || listKC == null) {
				equGoodsStock.setPid(pid);
				equGoodsStock.setConid(equGoodsStorein.getConid());
				equGoodsStock.setTreeuids(equGoodsStorein.getTreeUids());
				equGoodsStock.setBoxNo(obj.getBoxNo());
				equGoodsStock.setEquType(obj.getWarehouseType());
				equGoodsStock.setEquPartName(obj.getWarehouseName());
				equGoodsStock.setGgxh(obj.getGgxh());
				equGoodsStock.setGraphNo(obj.getGraphNo());
				equGoodsStock.setUnit(obj.getUnit());
				equGoodsStock.setWeight(obj.getWeight());
				equGoodsStock.setStorage(obj.getEquno());
				equGoodsStock.setStockNum(obj.getInWarehouseNo());
				equGoodsStock.setJudgment(judgment);
				equGoodsStock.setDataType(equGoodsStorein.getDataType());
				equGoodsStock.setStorage(obj.getEquno());
				equGoodsStock.setStockNo(obj.getStockno());
				equGoodsStock.setIntoMoney(obj.getIntoMoney());
				//统计库存金额：库存金额=该物资所有完结入库单的入库金额合计-该物资所有完结出库单的出库金额合计
				Double  getIntoTotalMoney = 0.00;
				Double  getOuntTotalMoney = 0.00;
				String where = "sbrkUids in (select uids from EquGoodsStoreinBack  where finished='1' and dataType='EQUBODY')"
						+ " and warehouseName='" + obj.getWarehouseName() + "' and warehouseType='" + obj.getWarehouseType()
						+ "' and  stockno='" + obj.getStockno() + "' and ggxh='" + obj.getGgxh() + "'";
				List<EquGoodsStoreinBackSub> list1 = this.equipmentDAO.findByWhere(EquGoodsStoreinBackSub.class.getName(), where);
			    if(list1.size()>0){
					for(int k=0;k<list1.size();k++){
						EquGoodsStoreinBackSub sub = list1.get(k);
				    	getIntoTotalMoney += sub.getTotalMoney(); 
				    }
			    }
				String where2 = "outId in (select uids from EquGoodsOutBack where finished='1' and dataType='EQUBODY')  and equPartName='"
						+ obj.getWarehouseName() + "' and equType='" + obj.getWarehouseType() + "' and boxNo='"
						+ obj.getStockno() + "' and ggxh='" + obj.getGgxh() + "'";
			    List<EquGoodsOutBackSub> list2 = this.equipmentDAO.findByWhere(EquGoodsOutBackSub.class.getName(), where2);
 				if(list2.size()>0){
 					for(int j=0;j<list2.size();j++){
 						EquGoodsOutBackSub outSub = list2.get(j);
 						getOuntTotalMoney += outSub.getAmount();
 					}
 				}
 				equGoodsStock.setKcMoney(getIntoTotalMoney+obj.getTotalMoney()-getOuntTotalMoney);
				this.equipmentDAO.insert(equGoodsStock);
			} else {
				equGoodsStock = (EquGoodsStock) listKC.get(0);
				equGoodsStock.setStockNum(equGoodsStock.getStockNum() + obj.getInWarehouseNo());
				this.equipmentDAO.saveOrUpdate(equGoodsStock);
			}
		}
		return "success";
	}

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
	public String getEquNewDhNoToSb(String pid, String prefix, String col,
			String table, Long lsh,String whereSql) {
		String bh = "";
		String newLsh = "";
		String where="";
		if(whereSql != ""|| whereSql != null){
			where = " and "+whereSql;
		}
		if (lsh == null) {
			String sql1 ="select trim(to_char(nvl(max(substr((substr("+col+",3,length("+col+"))),"+
                         " length('"+prefix+"') + 1,4)),0) + 1,'0000')) "+
                         " from "+table+"  where pid = '" + pid + "'" +where+
                         " and (substr("+col+",3,length("+col+")-6)) = '"+prefix+"'";
			List<String> list = this.equipmentDAO.getDataAutoCloseSes(sql1);
			if (list != null) {
				newLsh = list.get(0);
			}
		} else {
			NumberFormat ft = NumberFormat.getNumberInstance();
			ft.setMinimumIntegerDigits(4);
			ft.setGroupingUsed(false);
			newLsh = ft.format(lsh);

		}
		bh = prefix.concat(newLsh);
		return bh;
	}

	/**
	 * 暂估入库新增时保存到主表的记录
	 * @param equGoodsZGRKStorein
	 * @param pid
	 * @param uids
	 * @return
	 */
	public String saveOrUpdataEquZGRkGoodsStorein(EquGoodsStoreinEstimate equGoodsZGRKStorein, String pid, String uids) {
		String warehouseNo = equGoodsZGRKStorein.getWarehouseNo();
		String conid = equGoodsZGRKStorein.getConid();
		uids = equGoodsZGRKStorein.getUids();
		if ("".equals(uids)) {
			String whereSql = " pid='" + pid + "' and warehouseNo='" + warehouseNo + "' and conid='" + conid + "'";
			List<EquGoodsStoreinEstimate> list = this.equipmentDAO.findByWhere(EquGoodsStoreinEstimate.class.getName(), whereSql);
			if (list.size() > 0) {
				return "repeat";
			} else {
				ConOve conOve = (ConOve) this.equipmentDAO.findById(ConOve.class.getName(), equGoodsZGRKStorein.getConid());
				equGoodsZGRKStorein.setSupplyunit(conOve.getPartybno());

				this.equipmentDAO.insert(equGoodsZGRKStorein);
				return "success";
			}
		} else if (!"".equals(uids)) {
			this.equipmentDAO.saveOrUpdate(equGoodsZGRKStorein);
			return "success";
		}
		return "failure";
	}

	/**
	 * @author yanglh
	 * @date 2013年04月23日
	 * @see 设备管理主体设备中暂估入库新增明细是从主体设备选择功能安装
	 * @param getUids
	 * @param sbrkUids
	 * @return
	 */
	public String getEsSubFromEquGoodsBody(String[] getUids, String sbrkUids) {
		for(int i=0;i<getUids.length;i++){
			EquGoodsBodys getEquGB = (EquGoodsBodys)this.equipmentDAO.findById(EquGoodsBodys.class.getName(), getUids[i]);
			if(getEquGB == null){
				continue;
			}
			EquGoodsStoreinEstimateSub eses = new EquGoodsStoreinEstimateSub();
			eses.setSbrkUids(sbrkUids);
			eses.setStockno(getEquGB.getEquNo());
			eses.setWarehouseName(getEquGB.getEquName());
			eses.setGgxh(getEquGB.getGgxh());
			eses.setPid(getEquGB.getPid());
			//设置主体设备删除修改控制
			String updateSql = "update Equ_Goods_Bodys set del_or_update='0' where uids='"+getUids[i]+"'";
			this.equipmentDAO.updateBySQL(updateSql);
			this.equipmentDAO.insert(eses);
		}
		return "success";
	}

	/**
	 * @author yanglh
	 * @date 2013年04月23日
	 * @see 设备管理主体设备中暂估入库新增明细是从主体设备选择功能安装
	 * @param getUids
	 * @param sbrkUids
	 * @return
	 */
	public String saveOrUpdataEquGoodsStoreinSub(EquGoodsStoreinSub equGSSub) {
		this.equipmentDAO.insert(equGSSub);
		return "success";
	}

	/**
	 * @author yanglh
	 * @date 2013年04月23日
	 * @see 设备管理主体设备中正式入库新增明细是从主体设备选择功能安装
	 * @param getUids
	 * @param sbrkUids
	 * @return
	 */
	public String getEquSubFromEquGoodsBody(String[] getUids, String sbrkUids, String warehouseType) {
		for(int i=0;i<getUids.length;i++){
			EquGoodsBodys getEquGB = (EquGoodsBodys)this.equipmentDAO.findById(EquGoodsBodys.class.getName(), getUids[i]);
			if(getEquGB == null){
				continue;
			}
			EquGoodsStoreinSub eges = new EquGoodsStoreinSub();
			eges.setTreeuids(getEquGB.getTreeUids());
			eges.setSbrkUids(sbrkUids);
			eges.setStockno(getEquGB.getEquNo());
			eges.setWarehouseName(getEquGB.getEquName());
			eges.setGgxh(getEquGB.getGgxh());
			eges.setPid(getEquGB.getPid());
			eges.setWarehouseType(warehouseType);
			//设置默认的税率 与属性代码对应
			eges.setAmountRate("01");
			EquGoodsStorein storein = (EquGoodsStorein) this.equipmentDAO.findBeanByProperty("com.sgepit.pmis.equipment.hbm.EquGoodsStorein", "uids", eges.getSbrkUids());
			EquWarehouse warehouse = (EquWarehouse) this.equipmentDAO.findBeanByProperty("com.sgepit.pmis.equipment.hbm.EquWarehouse", "equid", storein.getEquid());
			eges.setEquno(warehouse.getUids());
			this.equipmentDAO.insert(eges);
			getEquGB.setDelOrUpdate("0");
			this.equipmentDAO.saveOrUpdate(getEquGB);
		}
		return "success";
	}

	/**
	 * 从暂估入库中选择
	 * 
	 * @param newNo
	 * @param uids
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String equGoodsIntoWarehousingFromZGRK(String newNo, String uids, String pid) {
		List<EquGoodsStoreinEstimate> list = this.equipmentDAO.findByWhere(
				EquGoodsStoreinEstimate.class.getName(), "uids='" + uids + "'");
		if (list.size() > 0) {
			EquGoodsStoreinEstimate egse = list.get(0);
			EquGoodsStorein egs = new EquGoodsStorein();
			egs.setPid(pid);
			egs.setConid(egse.getConid());
			egs.setTreeuids(egse.getTreeUids());
			egs.setFinished(Byte.parseByte("1"));
			egs.setWarehouseNo(newNo);
			egs.setWarehouseDate(new Date());
			egs.setNoticeNo(egse.getNoticeNo());
			egs.setWarehouseMan(egse.getWarehouseMan());
			egs.setMakeMan(egse.getMakeMan());
			egs.setAbnormalOrNo(egse.getAbnormalOrNo());
			egs.setSupplyunit(egse.getSupplyunit());
			egs.setOpenBoxId(egse.getOpenBoxId());
			egs.setUids(egse.getUids());
			egs.setInvoiceno(egse.getInvoiceno());
			egs.setEquid(egse.getEquid());
			egs.setDataType(egse.getDataType());
			egs.setFileid(egse.getFileid());
			// egs.setWarehouseBackNo();
			egs.setType("正式入库");
			egs.setWarehouseZgrkNo(egse.getWarehouseNo());
			this.equipmentDAO.insert(egs);
			List<EquGoodsStoreinEstimateSub> list1 = this.equipmentDAO.findByWhere(
					EquGoodsStoreinEstimateSub.class.getName(), "sbrk_uids='" + uids + "'");
			if (list1.size() > 0) {
				for (int i = 0; i < list1.size(); i++) {
					EquGoodsStoreinEstimateSub egsb = list1.get(i);
					EquGoodsStoreinSub egss = new EquGoodsStoreinSub();
					egss.setSbrkUids(egs.getUids());
					egss.setGgxh(egsb.getGgxh());
					egss.setMemo(egsb.getMemo());
					egss.setPid(egsb.getPid());
					egss.setBoxNo(egsb.getBoxNo());
					egss.setWarehouseType(egsb.getWarehouseType());
					egss.setWarehouseName(egsb.getWarehouseName());
					egss.setGraphNo(egsb.getGgxh());
					egss.setUnit(egsb.getUnit());
					egss.setWarehouseNum(egsb.getWarehouseNum());
					egss.setInWarehouseNo(egsb.getInWarehouseNo());
					egss.setIntoMoney(egsb.getIntoMoney());
					egss.setTotalMoney(egsb.getTotalMoney());
					egss.setEquno(egsb.getEquno());
					egss.setBoxSubId(egsb.getBoxSubId());
					egss.setWeight(egsb.getWeight());
					egss.setStockno(egsb.getStockno());
					egss.setTaxes(egsb.getTaxes());
					egss.setTotalnum(egsb.getTotalnum());
					egss.setUnitPrice(egsb.getUnitPrice());
					egss.setAmountMoney(egsb.getAmountMoney());
					egss.setFreightMoney(egsb.getFreightMoney());
					egss.setInsuranceMoney(egsb.getInsuranceMoney());
					egss.setAntherMoney(egsb.getAntherMoney());
					egss.setAmountTax(egsb.getAmountTax());
					egss.setFreightTax(egsb.getFreightTax());
					egss.setInsuranceTax(egsb.getInsuranceTax());
					egss.setAntherTax(egsb.getAntherTax());
					this.equipmentDAO.insert(egss);
				}
			}
			return "success";
		} else {
			return "failure";
		}
	}

	/**
	 * 更新设备暂估出库主表信息
	 * @param equOut
	 * @return
	 */
	public String addOrUpdateEquOutEstimate(EquGoodsOutEstimate equOut) {
		String uids = equOut.getUids();
		if (uids == null || uids.equals("")) {
			this.equipmentDAO.insert(equOut);
			return equOut.getUids();
		} else {
			this.equipmentDAO.saveOrUpdate(equOut);
			return equOut.getUids();
		}
	}

	/**
	 * 从库存中选择设备到暂估出库单明细
	 * @param uids
	 * @param id
	 * @param no
	 * @return
	 */
	public String insertEstimateOutSubFromStock(String[] uids, String id,
			String no) {
		for (int i = 0; i < uids.length; i++) {
			EquGoodsStock stock = (EquGoodsStock) this.equipmentDAO.findById(
					EquGoodsStock.class.getName(), uids[i]);

			if (stock != null) {
				EquGoodsOutEstimateSub outSub = new EquGoodsOutEstimateSub();
				outSub.setOutId(id);
				outSub.setOutNo(no);
				outSub.setPid(stock.getPid());
				// outSub.setBoxNo(stock.getBoxNo());
				outSub.setEquType(stock.getEquType());
				outSub.setEquPartName(stock.getEquPartName());
				outSub.setGgxh(stock.getGgxh());
				outSub.setGraphNo(stock.getGraphNo());
				outSub.setOutNum(0d);
				outSub.setStorage(stock.getStorage());
				outSub.setUnit(stock.getUnit());
				outSub.setStockId(stock.getUids());
				outSub.setBoxNo(stock.getStockNo());
				outSub.setPrice(stock.getIntoMoney());
				outSub.setKcMoney(stock.getKcMoney());
				this.equipmentDAO.saveOrUpdate(outSub);
			}
		}
		return "1";
	}

	/**
 	 * @param uids
 	 * @param id
 	 * @param no
 	 * @return
 	 */
	public String insertOutEsSubFromStock(String[] uids, String id, String no) {
		for (int i = 0; i < uids.length; i++) {
			EquGoodsStock stock = (EquGoodsStock) this.equipmentDAO.findById(
					EquGoodsStock.class.getName(), uids[i]);

			if (stock != null) {
				EquGoodsOutEstimateSub outSub = new EquGoodsOutEstimateSub();
				outSub.setOutId(id);
				outSub.setOutNo(no);
				outSub.setPid(stock.getPid());
				// outSub.setBoxNo(stock.getBoxNo());
				outSub.setEquType(stock.getEquType());
				outSub.setEquPartName(stock.getEquPartName());
				outSub.setGgxh(stock.getGgxh());
				outSub.setGraphNo(stock.getGraphNo());
				outSub.setOutNum(0d);
				outSub.setStorage(stock.getStorage());
				outSub.setUnit(stock.getUnit());
				outSub.setStockId(stock.getUids());
				this.equipmentDAO.saveOrUpdate(outSub);
			}
		}
		return "1";
	}

	/**
	 * 暂估出库删除
	 * @param uids
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String deleteEstimateOutAndOutSub(String uids) {
		if (uids != null && !"".equals(uids)) {
			EquGoodsOutEstimate out = (EquGoodsOutEstimate) this.equipmentDAO.findById(EquGoodsOutEstimate.class.getName(), uids);
			if (out != null) {
				List<EquGoodsOutEstimateSub> uousub = this.equipmentDAO.findByWhere(
						EquGoodsOutEstimateSub.class.getName(), "outId='" + uids + "'");
				if (uousub.size() > 0) {
					String updateSql = "merge into equ_goods_stock e using "
							+ "(select s.stock_id,s.out_Num from equ_goods_out_estimate_sub s where s.out_id='"
							+ uids
							+ "' and s.out_Num <> 0) o on(e.uids=o.stock_Id) when matched "
							+ "then update set e.stock_Num=e.stock_Num+o.out_Num ";
					String deleteSql = "delete from equ_goods_out_estimate_sub s where s.out_id='"
							+ uids + "'";
					JdbcUtil.update(updateSql);
					JdbcUtil.execute(deleteSql);
				}
				List<SgccAttachList> listSAL = this.equipmentDAO.findByWhere(
						SgccAttachList.class.getName(), "transaction_id ='" + uids + "'");
				if (listSAL.size() > 0) {
					for (int i = 0; i < listSAL.size(); i++) {
						SgccAttachList sal = listSAL.get(i);
						SgccAttachBlob sab = (SgccAttachBlob) this.equipmentDAO.findById(
								SgccAttachBlob.class.getName(), sal.getFileLsh());
						this.equipmentDAO.delete(sab);
						this.equipmentDAO.delete(sal);
					}
				}
				this.equipmentDAO.delete(out);
				return "0";
			}
		}
		return "1";
	}

	/**
	 * 冲回入库进行选择后把暂估入库的数据保存到冲回入库表中
	 * @param uids
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String insertEquGoodsOutBack(String uids, String newCkNo) {
		List<EquGoodsOutEstimate> list = this.equipmentDAO.findByWhere(
				EquGoodsOutEstimate.class.getName(), "uids='" + uids + "'");
		if (list.size() > 0) {
			EquGoodsOutEstimate egoe = list.get(0);
			EquGoodsOutBack egob = new EquGoodsOutBack();
			egob.setPid(egoe.getPid());
			egob.setConid(egoe.getConid());
			egob.setTreeuids(egoe.getTreeuids());
			egob.setFinished(0);
			egob.setIsInstallation(0);
			egob.setOutNo(egoe.getOutNo());
			egob.setOutDate(new Date());
			egob.setRecipientsUnit(egoe.getRecipientsUnit());
			egob.setGrantDesc(egoe.getGrantDesc());
			egob.setRecipientsUser(egoe.getRecipientsUser());
			egob.setRecipientsUnitManager(egoe.getRecipientsUnitManager());
			egob.setHandPerson(egoe.getHandPerson());
			egob.setShipperNo(egoe.getHandPerson());
			egob.setProUse(egoe.getProUse());
			egob.setEquid(egoe.getEquid());
			egob.setFileid(egoe.getFileid());
			egob.setUsing(egoe.getUsing());
			egob.setEquname(egoe.getEquname());
			egob.setOutOutNo(newCkNo);
			egob.setDataType(egoe.getDataType());
			egob.setType("冲回出库");
			this.equipmentDAO.insert(egob);
			List<EquGoodsOutEstimateSub> listSub = this.equipmentDAO.findByWhere(
					EquGoodsOutEstimateSub.class.getName(), "out_id='" + uids + "'");
			if (listSub.size() > 0) {
				for (int i = 0; i < listSub.size(); i++) {
					EquGoodsOutEstimateSub egoes = listSub.get(i);
					EquGoodsOutBackSub egobs = new EquGoodsOutBackSub();
					egobs.setPid(egoes.getPid());
					egobs.setOutId(egob.getUids());
					egobs.setOutNo(newCkNo);
					egobs.setBoxNo(egoes.getBoxNo());
					egobs.setEquType(egoes.getEquType());
					egobs.setEquPartName(egoes.getEquPartName());
					egobs.setGgxh(egoes.getGgxh());
					egobs.setGraphNo(egoes.getGraphNo());
					egobs.setUnit(egoes.getUnit());
					egobs.setOutNum(-egoes.getOutNum());
					egobs.setStorage(egoes.getStorage());
					egobs.setStockId(egoes.getStockId());
					egobs.setPrice((egoes.getPrice()==null)?0.00:-egoes.getPrice());
					egobs.setAmount((egoes.getAmount()==null)?0.00:-egoes.getAmount());
					this.equipmentDAO.insert(egobs);
				}
			}
			return "success";
		} else {
			return "failure";
		}
	}

	/**
  	 * 冲回出库删除
  	 * @param uids
  	 * @return
  	 */
	@SuppressWarnings("unchecked")
	public String deleteOutBackAndOutBackSub(String uids) {
		if (uids != null && !"".equals(uids)) {
			EquGoodsOutBack out = (EquGoodsOutBack) this.equipmentDAO.findById(
					EquGoodsOutBack.class.getName(), uids);
			if (out != null) {
				List<EquGoodsOutBackSub> uousub = this.equipmentDAO.findByWhere(EquGoodsOutBackSub.class.getName(), "outId='" + uids + "'");
				if (uousub.size() > 0) {
					String deleteSql = "delete from equ_goods_out_back_sub s where s.out_id='" + uids + "'";
					JdbcUtil.execute(deleteSql);
				}
				List<SgccAttachList> listSAL = this.equipmentDAO.findByWhere(SgccAttachList.class.getName(), "transaction_id='" + uids + "'");
				if (listSAL.size() > 0) {
					for (int i = 0; i < listSAL.size(); i++) {
						SgccAttachList sal = listSAL.get(i);
						SgccAttachBlob sab = (SgccAttachBlob) this.equipmentDAO.findById(SgccAttachBlob.class.getName(), sal.getFileLsh());
						this.equipmentDAO.delete(sab);
						this.equipmentDAO.delete(sal);
					}
				}
				this.equipmentDAO.delete(out);
				return "0";
			}
		}
		return "1";
	}

	/**
	 * 暂估出库单完结
	 * @param uids
	 * @return
	 */
	public String equOutEstimateFinished(String uids) {
		EquGoodsOutEstimate out = (EquGoodsOutEstimate) this.equipmentDAO.findById(EquGoodsOutEstimate.class.getName(), uids);
		if (out == null)
			return "0";
		if (out.getIsInstallation() == 1) {
			return "2";
		}
		Integer i = out.getFinished();
		out.setFinished((i == null || i == 0) ? 1 : 0);
		this.equipmentDAO.saveOrUpdate(out);
		return "1";
	}

	/**
	 * 冲回出库完结操作
	 * @param uids
	 * @return
	 */	
	@SuppressWarnings("unchecked")
	public String equOutBackFinished(String uids) {
		EquGoodsOutBack out = (EquGoodsOutBack) this.equipmentDAO.findById(EquGoodsOutBack.class.getName(), uids);
		if (out == null)
			return "0";
		if (out.getIsInstallation() == 1) {
			return "2";
		}
		Integer i = out.getFinished();
		out.setFinished((i == null || i == 0) ? 1 : 0);
		this.equipmentDAO.saveOrUpdate(out);
		if (out != null) {
			List<EquGoodsOutBackSub> list = this.equipmentDAO.findByWhere(
					EquGoodsOutBackSub.class.getName(), "out_id='" + out.getUids() + "'");
			if (list.size() > 0) {
				for (int j = 0; j < list.size(); j++) {
					EquGoodsOutBackSub egoes = list.get(j);
					String where = "uids='" + egoes.getStockId() + "' and conid='" + out.getConid() + "'";
					List<EquGoodsStock> egsArray = this.equipmentDAO.findByWhere(EquGoodsStock.class.getName(), where);
					if (egsArray.size() > 0) {
						EquGoodsStock egs = egsArray.get(0);
						egs.setStockNum(egs.getStockNum() - egoes.getOutNum());
						this.equipmentDAO.saveOrUpdate(egs);
					}
				}
			}
		}
		return "1";
	}

	/**
	 * 单据保存文档（设备入库单，出库单）
	 * @param fileid
	 * @param uids
	 * @param beanName
	 * @return
	 * @author zhangh 2012-09-28
	 */
	public String saveFile(String fileid, String uids, String beanName) {
		Class<?> demo = null;
		Field field = null;
		Object obj = this.equipmentDAO.findById(beanName, uids);
		try {
			demo = Class.forName(beanName);
			field = demo.getDeclaredField("fileid");
			field.setAccessible(true);
			field.set(obj, fileid);
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (NoSuchFieldException e) {
			e.printStackTrace();
		}
		return "1";
	}

	/**
	 * @author:shuz
	 */
	public String getEquNewDhNoToSbJn(String pid, String prefix, String col, String table, Long lsh,String whereSql,int length) {
		String bh = "";
		String newLsh = "";
		String where="";
		int len = length+3;
		if(whereSql != ""|| whereSql != null){
			where = " and "+whereSql;
		}
		if (lsh == null) {
			String sql1 ="select trim(to_char(nvl(max(substr((substr("+col+","+length+",length("+col+"))),"+
                         " length('"+prefix+"') + 1,4)),0) + 1,'0000')) "+
                         " from "+table+"  where pid = '" + pid + "'" +where+
                         " and (substr("+col+","+length+",length("+col+")-"+len+")) = '"+prefix+"'";
			List<String> list = this.equipmentDAO.getDataAutoCloseSes(sql1);
			if (list != null) {
				newLsh = list.get(0);
			}
		} else {
			NumberFormat ft = NumberFormat.getNumberInstance();
			ft.setMinimumIntegerDigits(4);
			ft.setGroupingUsed(false);
			newLsh = ft.format(lsh);

		}
		bh = prefix.concat(newLsh);
		return bh;
	}

	/**
	 * 暂估入库冲回
	 * @param uids，EquGoodsStorein
	 * @return “success” 成功，“failure” 失败
	 * @author yanlgh 2013-11-14
	 */
	@SuppressWarnings("unchecked")
	public String zgrkInsertChrkAndZsrk(String uids,EquGoodsStorein equ) {
		if(uids.equals("")){
			return "failure";
		}
		if (equ.getType().equals("冲回入库")){
			equ.setFinishedDate(new Date());
			equ.setFinishedUser(this.getCurrentUserid());
		}
		this.equipmentDAO.insert(equ);
		//获取对应主表的从表记录
		List<EquGoodsStoreinSub> list = this.equipmentDAO.findByWhere(EquGoodsStoreinSub.class.getName(),"sbrkUids='"+uids+"'");
		for(int i = 0; i < list.size(); i++){
			EquGoodsStoreinSub equSub = list.get(i);
			EquGoodsStoreinSub newEquSub = new EquGoodsStoreinSub();
			newEquSub.setGgxh(equSub.getGgxh());
			newEquSub.setMemo(equSub.getMemo());
			newEquSub.setPid(equSub.getPid());
			newEquSub.setSbrkUids(equ.getUids());
			newEquSub.setBoxNo(equSub.getBoxNo());
			newEquSub.setWarehouseType(equSub.getWarehouseType());
			newEquSub.setWarehouseName(equSub.getWarehouseName());
			newEquSub.setUnit(equSub.getUnit());
			newEquSub.setTotalMoney(equ.getType().equals("冲回入库")?(-equSub.getTotalMoney()):equSub.getTotalMoney());
			newEquSub.setEquno(equSub.getEquno());
			newEquSub.setWeight(equSub.getWeight());
			newEquSub.setStockno(equSub.getStockno());
			newEquSub.setTaxes(equ.getType().equals("冲回入库")?(-equSub.getTaxes()):equSub.getTaxes());
			newEquSub.setTotalnum(equ.getType().equals("冲回入库")?(-equSub.getTotalnum()):equSub.getTotalnum());
			newEquSub.setAmountMoney(equ.getType().equals("冲回入库")?(-equSub.getAmountMoney()):equSub.getAmountMoney());
			newEquSub.setFreightMoney(equ.getType().equals("冲回入库")?(-equSub.getFreightMoney()):equSub.getFreightMoney());
			newEquSub.setInsuranceMoney(equ.getType().equals("冲回入库")?(-equSub.getInsuranceMoney()):equSub.getInsuranceMoney());
			newEquSub.setAntherMoney(equ.getType().equals("冲回入库")?(-equSub.getAntherMoney()):equSub.getAntherMoney());
			newEquSub.setAmountTax(equ.getType().equals("冲回入库")?(-equSub.getAmountTax()):equSub.getAmountTax());
			newEquSub.setFreightTax(equ.getType().equals("冲回入库")?(-equSub.getFreightTax()):equSub.getFreightTax());
			newEquSub.setInsuranceTax(equ.getType().equals("冲回入库")?(-equSub.getInsuranceTax()):equSub.getInsuranceTax());
			newEquSub.setAntherTax(equ.getType().equals("冲回入库")?(-equSub.getAntherTax()):equSub.getAntherTax());
			newEquSub.setInWarehouseNo(equ.getType().equals("冲回入库")?(-equSub.getInWarehouseNo()):equSub.getInWarehouseNo());
			newEquSub.setWarehouseNum(equ.getType().equals("冲回入库")?(-equSub.getWarehouseNum()):equSub.getWarehouseNum());
			newEquSub.setGraphNo(equSub.getGraphNo());
			newEquSub.setUnitPrice(equSub.getUnitPrice());
			newEquSub.setIntoMoney(equSub.getIntoMoney());
			newEquSub.setJzNo(equSub.getJzNo());
			this.equipmentDAO.insert(newEquSub);
			if(equ.getType().equals("冲回入库")){
				List<EquGoodsStock> listKC = null;
				String whereSql = "conid='" + equ.getConid() + "' and pid='" + equ.getPid() +
						"' and join_unit='"+equ.getJoinUnit() + "' and stockNo='" + newEquSub.getStockno() + "'";
			    listKC = this.equipmentDAO.findByWhere(EquGoodsStock.class.getName(), whereSql);
			    Double beforeInNum = 0d;
			    Double beforeInMoney = 0d;
			    if(listKC.size()>0){
			    	EquGoodsStock equGoodsStock = (EquGoodsStock) listKC.get(0);
					
					beforeInNum = equGoodsStock.getStockNum() == null ? 0d : equGoodsStock.getStockNum();
				    beforeInMoney = equGoodsStock.getKcMoney() == null ? 0d : equGoodsStock.getKcMoney();
				    
					equGoodsStock.setEquType(newEquSub.getWarehouseType());
					equGoodsStock.setEquPartName(newEquSub.getWarehouseName());
					equGoodsStock.setGgxh(newEquSub.getGgxh());
					equGoodsStock.setUnit(newEquSub.getUnit());
					equGoodsStock.setIntoMoney(newEquSub.getIntoMoney());
					equGoodsStock.setStockNum(beforeInNum + (newEquSub.getInWarehouseNo() == null?0d:newEquSub.getInWarehouseNo()));
					equGoodsStock.setKcMoney(beforeInMoney + (newEquSub.getTotalMoney() == null?0d:newEquSub.getTotalMoney()));
					equGoodsStock.setStorage(newEquSub.getEquno());
					equGoodsStock.setSpecial(equ.getSpecial());
					equGoodsStock.setJzNo(newEquSub.getJzNo());
					this.equipmentDAO.saveOrUpdate(equGoodsStock);
				}
				// 主体设备冲回入库加入物资台账 pengy 2014-08-06
				insertEquGoodsTz(equ.getType(), equ, newEquSub);
			}
		}
		return "success";
	}

	/**
	 * 暂估出库冲回
	 * @param uids
	 * @param EquGoodsStockOut equ
	 * @return  “success” 成功，“failure” 失败
	 * @author yanlgh 2013-11-14
	 */
	@SuppressWarnings("unchecked")
	public String zgckInsertChckAndZsck(String uids, EquGoodsStockOut equ) {
		if (uids.equals("")) {
			return "failure";
		}
		if (equ.getType().equals("冲回出库")) {
			equ.setFinishedDate(new Date());
			equ.setFinishedUser(this.getCurrentUserid());
		}
		this.equipmentDAO.insert(equ);
		//获取对应主表的从表记录
		List<EquGoodsStockOutSub> list = this.equipmentDAO.findByWhere(EquGoodsStockOutSub.class.getName(), "outId='"+uids+"'");
		for(int i = 0; i < list.size(); i++){
			EquGoodsStockOutSub equSub = list.get(i);
			EquGoodsStockOutSub newEquSub = new EquGoodsStockOutSub();
			newEquSub.setPid(equSub.getPid());
			newEquSub.setOutId(equ.getUids());
			newEquSub.setOutNo(equSub.getOutNo());
			newEquSub.setBoxNo(equSub.getBoxNo());
			newEquSub.setEquType(equSub.getEquType());
			newEquSub.setEquPartName(equSub.getEquPartName());
			newEquSub.setGgxh(equSub.getGgxh());
			newEquSub.setGraphNo(equSub.getGraphNo());
			newEquSub.setUnit(equSub.getUnit());
			newEquSub.setOutNum(equ.getType().equals("冲回出库")?(-equSub.getOutNum()):equSub.getOutNum());
			newEquSub.setPrice(equSub.getPrice());
			newEquSub.setAmount(equ.getType().equals("冲回出库")?(-equSub.getAmount()):equSub.getAmount());
			newEquSub.setStorage(equSub.getStorage());
			newEquSub.setKcMoney(equSub.getKcMoney());
			newEquSub.setUseParts(equSub.getUseParts());
			newEquSub.setKksNo(equSub.getKksNo());
			newEquSub.setInNum(equSub.getInNum());
			newEquSub.setInUids(equSub.getInUids());
			newEquSub.setStockId(equSub.getStockId());
			newEquSub.setInSubUids(equSub.getInSubUids());
			newEquSub.setMemo(equSub.getMemo());
			newEquSub.setEquBoxNo(equSub.getEquBoxNo());
			newEquSub.setJzNo(equSub.getJzNo());
			EquGoodsStorein in = (EquGoodsStorein) this.equipmentDAO.findById(EquGoodsStorein.class.getName(), equSub.getInUids());
			newEquSub.setSpecial(in.getSpecial());
			
			this.equipmentDAO.insert(newEquSub);
			if(equ.getType().equals("冲回出库") || equ.getType().equals("正式出库")){
				List<EquGoodsStock> listKC = null;
				String whereSql = "conid='" + equ.getConid() + "' and pid='" + equ.getPid() + "' and join_unit='"
								+ equ.getRecipientsUnit() + "' and stockNo = '" + newEquSub.getBoxNo() + "'";
			    listKC = this.equipmentDAO.findByWhere(EquGoodsStock.class.getName(), whereSql);
			    Double beforeInNum = 0d;
			    Double beforeInMoney = 0d;
			    if(listKC.size()>0){
			    	EquGoodsStock equGoodsStock = new EquGoodsStock();
					equGoodsStock = (EquGoodsStock) listKC.get(0);
					
					beforeInNum = equGoodsStock.getStockNum() == null ? 0d : equGoodsStock.getStockNum();
				    beforeInMoney = equGoodsStock.getKcMoney() == null ? 0d : equGoodsStock.getKcMoney();
				    
					equGoodsStock.setEquType(newEquSub.getEquType());
					equGoodsStock.setEquPartName(newEquSub.getEquPartName());
					equGoodsStock.setGgxh(newEquSub.getGgxh());
					equGoodsStock.setUnit(newEquSub.getUnit());
					equGoodsStock.setStockNum(beforeInNum - (newEquSub.getOutNum() == null?0d:newEquSub.getOutNum()));
					equGoodsStock.setKcMoney(beforeInMoney - (newEquSub.getAmount() == null?0d:newEquSub.getAmount()));
					equGoodsStock.setStorage(newEquSub.getStorage());
					this.equipmentDAO.saveOrUpdate(equGoodsStock);
				}
				if (equ.getType().equals("冲回出库")) {
					// 主体设备冲回出库加入物资台账 pengy 2014-08-06
					insertEquGoodsTz(equ.getType(), equ, newEquSub);
				}
			}
		}
		return "success";
	}

	/**
	 * 后台直接获取session中用户userid
	 * @return
	 * @author zhangh 2013-8-14
	 */
	private String getCurrentUserid(){
		String finiUser = "";
		WebContext webContext = WebContextFactory.get();    
		if(webContext!=null){
			HttpSession session = webContext.getSession() ;
			finiUser = session.getAttribute(Constant.USERID).toString(); 
		}
		return finiUser;
	}

	/**
	 * 主体设备记录完结时的入库主从表信息做台账
	 * yanglh	2013-8-9
	 * @param pid
	 * @param mainTable
	 * @param fromTableUids 从表主键
	 * @param fromTableSubNum 从表填写时的数量
	 * @param inOrOut:RK--记录入库信息，CK--记录出库信息
	 */
	@SuppressWarnings("unchecked")
	public void insertSubToFinishedRecord(String pid, String mainTableUids,String fromTableUids,String fromTableSubNum,String inOrOut) {
		if(inOrOut.equals("RK")){
			EquGoodsStorein getEquGS = (EquGoodsStorein)this.equipmentDAO.findById(EquGoodsStorein.class.getName(), mainTableUids);
			//先查询数据是否存在，如存在删除，
			List<EquGoodsFinishedRecord> delList = this.equipmentDAO.findByWhere(EquGoodsFinishedRecord.class.getName(), "finiUids='"+mainTableUids+"'");
			if(delList.size()>0){
				this.equipmentDAO.deleteAll(delList);
			}
			List<EquGoodsStoreinSub> list = this.equipmentDAO.findByWhere(EquGoodsStoreinSub.class.getName(), "sbrk_uids='"+mainTableUids+"'");
			if(list.size()>0){
				for(int i = 0;i < list.size();i ++){
					EquGoodsStoreinSub getSub = list.get(i);
					EquGoodsFinishedRecord equRecord = new EquGoodsFinishedRecord();
					equRecord.setPid(getEquGS.getPid());
					equRecord.setConid(getEquGS.getConid());
					equRecord.setFiniTime(new Date());
					equRecord.setFiniUids(getEquGS.getUids());
					equRecord.setFiniNo(getEquGS.getWarehouseNo());
					equRecord.setFiniSubUids(getSub.getSbrkUids());
					equRecord.setFiniSubNo(getSub.getStockno());
					equRecord.setFiniSubNum(getSub.getInWarehouseNo());
					//取库存物资相同编码的 数量的和，库存金额的和及最大的单价三者的值
				    String sql = "select  nvl(sum(t.stock_num),0),nvl(sum(t.kc_money),0),nvl(max(t.into_money),0) " +
				    		     " from Equ_Goods_Stock t where t.data_type='EQUBODY' and t.make_type='正式入库' " +
				    		     " and t.stock_no='"+getSub.getStockno()+"'";
				    List<Object[]> tempList = this.equipmentDAO.getDataAutoCloseSes(sql);
				    for(Object[] obj:tempList){
						equRecord.setFiniStockNum(Double.valueOf(obj[0].toString()));
						equRecord.setFiniStockPrice(Double.valueOf(obj[2].toString()));
						equRecord.setFiniStockMoney(Double.valueOf(obj[1].toString()));				    	
				    }
					equRecord.setFiniInOut("RK");
					equRecord.setFiniType("SB");
					this.equipmentDAO.insert(equRecord);
				}
			}
		} else if (inOrOut.equals("CK")) {
			EquGoodsFinishedRecord equRecord = new EquGoodsFinishedRecord();
			EquGoodsStockOut stockOut = (EquGoodsStockOut) this.equipmentDAO.findById(EquGoodsStockOut.class.getName(), mainTableUids);
			EquGoodsStockOutSub outSub = (EquGoodsStockOutSub) this.equipmentDAO.findById(EquGoodsStockOutSub.class.getName(),fromTableUids);
			// 查询台账中有无数据
			List<EquGoodsFinishedRecord> getList = this.equipmentDAO.findByWhere(EquGoodsFinishedRecord.class.getName(),
							"finiSubUids='" + fromTableUids + "'");
			if (getList != null) {
				equRecord.setFiniSubNum(Double.valueOf(fromTableSubNum));
				this.equipmentDAO.saveOrUpdate(equRecord);
			} else {
				equRecord.setPid(stockOut.getPid());
				equRecord.setConid(stockOut.getConid());
				equRecord.setFiniTime(new Date());
				equRecord.setFiniUids(stockOut.getUids());
				equRecord.setFiniNo(stockOut.getOutNo());
				equRecord.setFiniSubUids(outSub.getUids());
				equRecord.setFiniSubNo(outSub.getBoxNo());
				equRecord.setFiniSubNum(Double.valueOf(fromTableSubNum));
				// 取库存物资相同编码的 数量的和，库存金额的和及最大的单价三者的值
				String sql = "select nvl(sum(t.stock_num),0),nvl(sum(t.kc_money),0),nvl(max(t.into_money),0) from "
						+ "Equ_Goods_Stock t where t.data_type='EQUBODY' and t.stock_no='" + outSub.getBoxNo() + "'";
				List<Object[]> tempList = this.equipmentDAO.getDataAutoCloseSes(sql);
				for (Object[] obj : tempList) {
					equRecord.setFiniStockNum(Double.valueOf(obj[0].toString()));
					equRecord.setFiniStockPrice(Double.valueOf(obj[2].toString()));
					equRecord.setFiniStockMoney(Double.valueOf(obj[1].toString()));
				}
				equRecord.setFiniInOut("CK");
				equRecord.setFiniType("SB");
				this.equipmentDAO.insert(equRecord);
			}
		}
	}

	/**
	 * 出库中删除未完结的已经保存到台账的数据
	 * @param mainUids
	 * @param fromTableUids
	 */
	public void delEquGoodsFinishedRecord(String mainUids){
		List<EquGoodsFinishedRecord> delList = this.equipmentDAO.findByWhere(EquGoodsFinishedRecord.class.getName(), "finiUids='"+mainUids+"'");
		if(delList.size() >0)
		     this.equipmentDAO.deleteAll(delList);
	}

	public String getEquNewDhNoToSbCG(String pid, String prefix, String col, String table, Long lsh,String whereSql) {
		String bh = "";
		String newLsh = "";
		String where="";
		if(whereSql != ""|| whereSql != null){
			where = " and "+whereSql;
		}
		if (lsh == null) {
			String sql = "select trim(to_char(nvl(max(substr(" + col
						+ ",length('" + prefix + "') +1, 4)),0) +1,'0000')) from "
						+ table + " where pid = '" + pid + "'" +where+" and  substr(" + col
						+ ",1,length('" + prefix + "')) ='" + prefix + "'";
			List<String> list = this.equipmentDAO.getDataAutoCloseSes(sql);
			if (list != null) {
				newLsh = list.get(0);
			}
		} else {
			NumberFormat ft = NumberFormat.getNumberInstance();
			ft.setMinimumIntegerDigits(4);
			ft.setGroupingUsed(false);
			newLsh = ft.format(lsh);

		}
		bh = prefix.concat(newLsh);
		return bh;
	}	

	/**
	 * 初始化物资台帐
	 * @param selectTreeId 物资台帐类型
	 * @param pid 
	 * @author zhangh 2013-8-10
	 */
	public void initEquWzTz(String selectTreeId, String pid){
		String del_sql = "DELETE EQU_GOODS_TZ WHERE FINISHED=1";
		//查出节点下所有出入库
		String sql = "SELECT * FROM EQU_GOODS_TZ_VIEW ";
		String orderby = "ORDER BY IN_SUB_UIDS ASC,CHBM ASC,DANHAO DESC,SHRQ ASC";//DANHAO RK在CK前
//		if (null != selectTreeId && !"".equals(selectTreeId)){
//			del_sql += " AND TYPE LIKE '"+selectTreeId+"%'";
//			sql += "WHERE EQUTYPE LIKE '" + selectTreeId + "%' ";
//		}
		JdbcUtil.execute(del_sql);
		List<Map<String, Object>> list = JdbcUtil.query(sql + orderby);
		Double num = 0d;
		Double price = 0d;
		Double money = 0d;
		String lastBm = "";
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
		for (int i = 0; i < list.size(); i++) {
			Map<String, Object> objs = list.get(i);
			EquGoodsTz tz = new EquGoodsTz();
			tz.setPid(pid);
			String equtype = objs.get("EQUTYPE") == null ? "" : objs.get("EQUTYPE").toString();
			tz.setType(equtype);// EQUTYPE
			String sjStr = objs.get("SHRQ") == null ? "" : objs.get("SHRQ").toString();// SHRQ
			try {
				tz.setShrq(sdf.parse(sjStr));
			} catch (ParseException e) {
				try {
					tz.setShrq(sdf1.parse(sjStr));
				} catch (ParseException e1) {
				}
			}

			String bm = objs.get("IN_SUB_UIDS") != null ? objs.get("IN_SUB_UIDS").toString()
					: objs.get("CHBM") == null ? "" :objs.get("CHBM").toString();
			tz.setChbm(objs.get("CHBM") == null ? "" :objs.get("CHBM").toString());// CHBM
			tz.setChmc(objs.get("CHMC") == null ? "" : objs.get("CHMC").toString());// CHMC
			tz.setGgxh(objs.get("GGXH") == null ? "" : objs.get("GGXH").toString());// GGXH
			tz.setDw(objs.get("DW") == null ? "" : objs.get("DW").toString());// DW
			String isRk = equtype.substring(4,6);
			if (isRk.equals("RK")) {
//				if (!lastBm.equals(bm)) {
					// 第一次添加物资设备
				num = 0d;
				price = 0d;
				money = 0d;
				//不再合并物资，故期初为0
				tz.setFiniStockNum(num);
				tz.setFiniStockPrice(price);
				tz.setFiniStockMoney(money);

				num += ((BigDecimal) objs.get("IN_NUM")).doubleValue();// IN_NUM
				price = ((BigDecimal) objs.get("IN_PRICE")).doubleValue();// IN_PRICE
				money += ((BigDecimal) objs.get("IN_AMOUNT")).doubleValue();// IN_AMOUNT
			} else if (isRk.equals("CK")) {
				if (!lastBm.equals(bm)) {// 第一次添加物资设备
					num = ((BigDecimal) objs.get("FINI_STOCK_NUM")).doubleValue();// FINI_STOCK_NUM
					price = ((BigDecimal) objs.get("FINI_STOCK_PRICE")).doubleValue();// FINI_STOCK_PRICE
					money = ((BigDecimal) objs.get("FINI_STOCK_MONEY")).doubleValue();// FINI_STOCK_MONEY
				}
				tz.setFiniStockNum(num);
				tz.setFiniStockPrice(price);
				tz.setFiniStockMoney(money);

				num -= ((BigDecimal) objs.get("OUT_NUM")).doubleValue();// OUT_NUM
				money -= ((BigDecimal) objs.get("OUT_AMOUNT")).doubleValue();//OUT_AMOUNT
			}

			tz.setStockNum(num);
			tz.setStockPrice(price);
			tz.setStockMoney(money);

			lastBm = bm;

			tz.setInNum(((BigDecimal) objs.get("IN_NUM")).doubleValue());
			tz.setInPrice(((BigDecimal) objs.get("IN_PRICE")).doubleValue());
			tz.setInAmount(((BigDecimal) objs.get("IN_AMOUNT")).doubleValue());

			tz.setOutNum(((BigDecimal) objs.get("OUT_NUM")).doubleValue());// OUT_NUM
			tz.setOutPrice(((BigDecimal) objs.get("OUT_PRICE")).doubleValue());// OUT_PRICE
			tz.setOutAmount(((BigDecimal) objs.get("OUT_AMOUNT")).doubleValue());// OUT_AMOUNT

			tz.setLlyt(objs.get("LLYT") == null ? "" : objs.get("LLYT").toString());// LLYT
			tz.setCwkm(objs.get("CWKM") == null ? "" : objs.get("CWKM").toString());// CWKM
			String rqStr = objs.get("RIQI") == null ? "" : objs.get("RIQI").toString();// RIQI
			try {
				tz.setRiqi(sdf.parse(rqStr));
			} catch (ParseException e) {
				try {
					tz.setRiqi(sdf1.parse(rqStr));
				} catch (ParseException e1) {
				}
			}

			tz.setDanhao(objs.get("DANHAO") == null ? "" : objs.get("DANHAO").toString());// DANHAO
			tz.setCangkuType(objs.get("CANGKU_TYPE") == null ? "" : objs.get("CANGKU_TYPE").toString());// CANGKU_TYPE
			tz.setCangku(objs.get("CANGKU") == null ? "" : objs.get("CANGKU").toString());// CANGKU
			tz.setKczz(objs.get("KCZZ") == null ? "" : objs.get("KCZZ").toString());// KCZZ
			tz.setConno(objs.get("CONNO") == null ? "" : objs.get("CONNO").toString());// CONNO
			tz.setGhdw(objs.get("GHDW") == null ? "" : objs.get("GHDW").toString());// GHDW
			tz.setZdr(objs.get("ZDR") == null ? "" : objs.get("ZDR").toString());// ZDR
			tz.setShr(objs.get("SHR") == null ? "" : objs.get("SHR").toString());// SHR
			tz.setKks(objs.get("KKS") == null ? "" : objs.get("KKS").toString());// KKS
			tz.setAzbw(objs.get("AZBW") == null ? "" : objs.get("AZBW").toString());// AZBW
			tz.setConttreetype(objs.get("CONTTREETYPE") == null ? "" : objs.get("CONTTREETYPE").toString());// CONTTREETYPE
			tz.setInSubUids(objs.get("IN_SUB_UIDS") == null ? "" : objs.get("IN_SUB_UIDS").toString());
			tz.setEquType(objs.get("EQU_TYPE") == null ? "" : objs.get("EQU_TYPE").toString());
			tz.setConmoneyno("");// CONMONEYNO
			tz.setFinished(1L);
			
			this.equipmentDAO.insert(tz);
		}
	}

	/**
	 * 查询物资台账，按照物资、时间的双重排序
	 * @param beanName	实体类名
	 * @param where		查询调教
	 * @param orderBy	排序条件：物资编码
	 * @param firstRow	起始行
	 * @param maxRow	查询条数
	 * @return	查询数据集合加总记录数
	 * @author pengy 2013-09-10
	 * --------------------------------------------------------
	 * 主体设备、主体材料不合并，按照入库单明细主键来判断是否是同一物资
	 * 主体设备、主体材料用入库单明细，存货编码，时间三重排序
	 * @author pengy 2013-11-06
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public List findWzOrderBy(String beanName, String where, String orderBy, Integer firstRow, Integer maxRow){
		List newEquTz = new ArrayList();
		/**多取出需要展示的数据的前一条，和后一条，前一条用来判断需显示的第一条数据是否是当前物资的第一条数据，
		后一条用来判断显示的最后一条数据是否是当前物资的最后一条数据*/
		if (firstRow != null && maxRow != null){
			if (firstRow > 0){
				firstRow = firstRow - 1;
				maxRow = maxRow + 1;
			}
			maxRow = maxRow + 1;
		}
		List equs = this.equipmentDAO.findByWhere(beanName, where, orderBy, firstRow, maxRow);
		if (equs.size() == 1){//0条数据
			newEquTz.add(equs.get(0));
			return newEquTz;
		} else if(equs.size() == 2){//1条数据
			EquGoodsTz tz = (EquGoodsTz) equs.get(0);
			tz.setFlag("both");
			newEquTz.add(tz);
			return newEquTz;
		}
		//是主体设备、主体材料、备品备件、专用工具，则为true；是综合部、生产准备部，则为false;
		boolean isEqu = true;
		if (orderBy.indexOf("chbm")==0){
			isEqu = false;
		}
		String wzbmPrev = "";//前一条数据的入库单主键或物资编码
		String wzbmNext = "";//后一条数据的入库单主键或物资编码
		for (int i=0; i < equs.size(); i++){
			EquGoodsTz tz = (EquGoodsTz) equs.get(i);
			//存在入库单主键则以入库单主键判断
			String wzbm = isEqu && tz.getInSubUids() != null ? tz.getInSubUids() : tz.getChbm() != null ? tz.getChbm() : "";
			//第一条first,最后一条last,都不是none,都是both
			String flag = "";
			if (i == 0){
				//如果是第一页的第一条数据，则此数据一定是第一条；如果不是第一页的，则记录此数据的物资编码
				if (firstRow == 0){
					//主体设备、主体材料不合并，按照入库单明细主键来判断是否是同一物资 pengy 2013-11-06
					wzbmNext = ((EquGoodsTz) equs.get(1)).getInSubUids() != null
							? ((EquGoodsTz) equs.get(1)).getInSubUids() : ((EquGoodsTz) equs.get(1)).getChbm();
					flag = wzbm.equals(wzbmNext) ? "first" : "both";
					tz.setFlag(flag);
					newEquTz.add(tz);
				}
				wzbmPrev = wzbm;
				continue;
			}
			if (i < equs.size()-2){
				wzbmNext = isEqu && ((EquGoodsTz) equs.get(i+1)).getInSubUids() != null
						? ((EquGoodsTz) equs.get(i+1)).getInSubUids() : ((EquGoodsTz) equs.get(i+1)).getChbm();
				if (wzbm.equals(wzbmPrev)){
					flag = wzbm.equals(wzbmNext) ? "none" : "last";
				} else {
					flag = wzbm.equals(wzbmNext) ? "first" : "both";
				}
				tz.setFlag(flag);
				newEquTz.add(tz);
				wzbmPrev = wzbm;
			} else {
				if (equs.size() < 21){
					flag = wzbm.equals(wzbmPrev) ? "last" : "both";
					tz.setFlag(flag);
					newEquTz.add(tz);
				}
				newEquTz.add(equs.get(i+1));
				break;
			}
		}
		return newEquTz;
	}

	/**
	 * 初始化未完结物资台帐
	 * @param selectTreeId 物资台帐类型
	 * @param pid 
	 * @author pengy 2013-09-22
	 * ----------------------------------------------
	 * 主体设备、主体材料不合并，按照入库单明细主键来判断是否是同一物资，故入库期初都是0
	 * @author pengy 2013-11-06
	 */
	public String initEquUnfinishWzTz(String selectTreeId, String pid){
		String del_sql = "DELETE EQU_GOODS_TZ WHERE FINISHED=0";
		String sql = "SELECT * FROM EQU_GOODS_TZ_ALL_VIEW";
		String orderby = " ORDER BY IN_SUB_UIDS ASC,CHBM ASC,FINISHED DESC,DANHAO DESC,SHRQ ASC";//DANHAO RK在CK前
//		if (selectTreeId != null && !selectTreeId.equals("")){
//			del_sql += " AND TYPE like '"+selectTreeId+"%'";
//			sql += " WHERE EQUTYPE like '"+selectTreeId+"%'";
//		}
		JdbcUtil.execute(del_sql);
		List list = this.equipmentDAO.getDataAutoCloseSes(sql + orderby);
		Double num = 0d;
		Double price = 0d;
		Double money = 0d;
		String lastBm = "";
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
		for (int i = 0; i < list.size(); i++) {
			Object[] objs=(Object[])list.get(i);
			EquGoodsTz tz = new EquGoodsTz();
			String equtype = objs[1]==null ? "" : objs[1].toString();//出入库类型
			String bm = objs[34] != null ? objs[34].toString()
					: objs[3] == null ? "" : objs[3].toString();//编码
			String isFinished = objs[33]==null? "" : objs[33].toString();//是否完结
			if(equtype.indexOf("RK") > 0){
				if(!lastBm.equals(bm)){//第一次添加物资设备
					num = 0d;
					price = 0d;
					money = 0d;
				}
				//BM相同，第二次添加物资设备
				if (isFinished.equals("0")){
//					tz.setFiniStockNum(num);
//					tz.setFiniStockPrice(price);
//					tz.setFiniStockMoney(money);
					//不再合并，入库期初都为0
					tz.setFiniStockNum(0d);
					tz.setFiniStockPrice(0d);
					tz.setFiniStockMoney(0d);
				}
				
				num += ((BigDecimal)objs[10]).doubleValue();//IN_NUM
				price = ((BigDecimal)objs[11]).doubleValue();//IN_PRICE
				money += ((BigDecimal)objs[12]).doubleValue();//IN_AMOUNT
				
				if (isFinished.equals("0")){
					tz.setStockNum(num);
					tz.setStockPrice(price);
					tz.setStockMoney(money);
				}
			}else if(equtype.indexOf("CK") > 0){
				if(!lastBm.equals(bm)){//第一次添加物资设备
					num = ((BigDecimal)objs[7]).doubleValue();//FINI_STOCK_NUM
					price = ((BigDecimal)objs[8]).doubleValue();//FINI_STOCK_PRICE
					money = ((BigDecimal)objs[9]).doubleValue();//FINI_STOCK_MONEY
				}
				//BM相同，第二次添加物资设备
				if (isFinished.equals("0")){
					tz.setFiniStockNum(num);
					tz.setFiniStockPrice(price);
					tz.setFiniStockMoney(money);
				}
				
				num -= ((BigDecimal)objs[13]).doubleValue();//OUT_NUM
				//price = ((BigDecimal)objs[14]).doubleValue();//OUT_PRICE//出库单价不发生变化
				money -= ((BigDecimal)objs[15]).doubleValue();//OUT_AMOUNT
				
				if (isFinished.equals("0")){
					tz.setStockNum(num);
					tz.setStockPrice(price);
					tz.setStockMoney(money);
				}
			}
			lastBm = bm;
			if (isFinished.equals("0")){
				tz.setPid(pid);
				tz.setType(equtype);//EQUTYPE
				String sjStr = objs[2]==null?"":objs[2].toString();//SHRQ
				try {
					tz.setShrq(sdf.parse(sjStr));
				} catch (ParseException e) {
					try {
						tz.setShrq(sdf1.parse(sjStr));
					} catch (ParseException e1) {
						return "flase";
					}
				}
				tz.setChbm(objs[3] == null ? "" : objs[3].toString());//CHBM
				tz.setChmc(objs[4]==null?"":objs[4].toString());//CHMC
				tz.setGgxh(objs[5]==null?"":objs[5].toString());//GGXH
				tz.setDw(objs[6]==null?"":objs[6].toString());//DW
				tz.setInNum(((BigDecimal)objs[10]).doubleValue());
				tz.setInPrice(((BigDecimal)objs[11]).doubleValue());
				tz.setInAmount(((BigDecimal)objs[12]).doubleValue());
				tz.setOutNum(((BigDecimal)objs[13]).doubleValue());//out_num
				tz.setOutPrice(((BigDecimal)objs[13]).doubleValue() != 0 ? ((BigDecimal)objs[14]).doubleValue() : 0);//out_price
				tz.setOutAmount(((BigDecimal)objs[15]).doubleValue());//out_amount
				tz.setLlyt(objs[16]==null?"":objs[16].toString());//LLYT
				tz.setCwkm(objs[17]==null?"":objs[17].toString());//CWKM
				String rqStr = objs[21]==null?"":objs[21].toString();//RIQI
				try {
					tz.setRiqi(sdf.parse(rqStr));
				} catch (ParseException e) {
					try {
						tz.setRiqi(sdf1.parse(rqStr));
					} catch (ParseException e1) {
						return "flase";
					}
				}
				tz.setDanhao(objs[22]==null?"":objs[22].toString());//DANHAO
				tz.setCangkuType(objs[23]==null?"":objs[23].toString());//CANGKU_TYPE
				tz.setCangku(objs[24]==null?"":objs[24].toString());//CANGKU
				tz.setKczz(objs[25]==null?"":objs[25].toString());//KCZZ
				tz.setConno(objs[26]==null?"":objs[26].toString());//CONNO
				tz.setGhdw(objs[27]==null?"":objs[27].toString());//GHDW
				tz.setZdr(objs[28]==null?"":objs[28].toString());//ZDR
				tz.setShr(objs[29]==null?"":objs[29].toString());//SHR
				tz.setKks(objs[30]==null?"":objs[30].toString());//KKS
				tz.setAzbw(objs[31]==null?"":objs[31].toString());//AZBW
				tz.setConmoneyno("");//CONMONEYNO
				tz.setConttreetype(objs[32]==null?"":objs[32].toString());//CONTTREETYPE
				tz.setInSubUids(objs[34]==null?"":objs[34].toString());//IN_SUB_UIDS
				tz.setEquType(objs[35]==null?"":objs[35].toString());//EQU_TYPE
				tz.setFinished(0L);

				this.equipmentDAO.insert(tz);
			}
		}
		return "true";
	}

	/**
	 * 向物资台账模板写入数据
	 * @param map1	查询条件
	 * @param wb	工作簿
	 * @return Excel输出流
	 * @author pengy 2013-09-23
	 */
	public ByteArrayOutputStream fillDataToEquGoodsTzExcel(Workbook wb, Map<String, String> map1) throws DbPropertyException, SQLException, IOException, ExcelPortException {
		if(wb!=null) {
			HashMap<String,CellStyle> stylesMap = new HashMap<String,CellStyle>();//样式map，存放各种样式
			int sheetNumber = wb.getNumberOfSheets(); // 获得总sheet数
			for (int i = 0; i < sheetNumber; i++) {
				Sheet sheet = wb.getSheetAt(i);
				SheetControlBean sheetControlBean = SheetControlBean.getSheetControlBean(sheet,map1);
				if(sheetControlBean!=null) {
					//获取数据
					List<Map<String,Object>> list = getDataBySheetControlBean(sheetControlBean);
					if(list!=null) {
						int rownum = sheetControlBean.getRowIndex()+1 ;
						List<ColumnControlBean> beans = sheetControlBean.getColumnBeans();
						//写入数据
						String wzbmPrev = "";//前一条数据的入库单明细或物资编码
						String wzbmNext = "";//后一条数据的入库单明细或物资编码
						for(int j=0; j<list.size(); j++) {
							Map<String,Object> map = list.get(j);
							Row hssfRow = sheet.getRow(rownum);
							if(hssfRow==null) {
								hssfRow = sheet.createRow(rownum);
							}
							//入库单明细或物资编码
							String wzbm = map.get("in_sub_uids") != null ? map.get("in_sub_uids").toString()
									: map.get("chbm") != null ? map.get("chbm").toString() : "";
							
							String flag = "";
							if (j == 0){
								if (list.size() > 1){
									wzbmNext = list.get(1).get("in_sub_uids") != null
											? list.get(1).get("in_sub_uids").toString() : list.get(1).get("chbm").toString();
									flag = wzbm.equals(wzbmNext) ? "first" : "both";
								} else {
									flag = "both";
								}
							} else if(j>0 && j<list.size()-1){
								wzbmNext = list.get(j+1).get("in_sub_uids") != null ? list.get(j+1).get("in_sub_uids").toString()
										: list.get(j+1).get("chbm") != null ? list.get(j+1).get("chbm").toString() : "";
								if (wzbm.equals(wzbmPrev)){
									flag = wzbm.equals(wzbmNext) ? "none" : "last";
								}else {
									flag = wzbm.equals(wzbmNext) ? "first" : "both";
								}
							} else if(j == list.size()-1){
								flag = wzbm.equals(wzbmPrev) ? "last" : "both";
							}
							wzbmPrev = wzbm;

							for(ColumnControlBean bean : beans) {
								String colName = bean.getColName().replaceAll(" ", "");
								Object value = map.get(colName);
								if (colName.equalsIgnoreCase("FINI_STOCK_NUM") ||
										colName.equalsIgnoreCase("FINI_STOCK_PRICE") || colName.equalsIgnoreCase("FINI_STOCK_MONEY")){
									if (flag.equals("last") || flag.equals("none")){
										value = null;
									}
								} else if (colName.equalsIgnoreCase("STOCK_NUM") ||
										colName.equalsIgnoreCase("STOCK_PRICE") || colName.equalsIgnoreCase("STOCK_MONEY")){
									if (flag.equals("first") || flag.equals("none")){
										value = null;
									}
								}
								int colIndex = bean.getColIndex();
								Cell hssfCell = hssfRow.getCell(colIndex);
								if(hssfCell==null) {
									hssfCell = hssfRow.createCell(colIndex);
								}
								Short dataFormat = null;
								//四舍五入保留小数点后两位，不足的补0
								//需处理的字段：期初单价、期初金额、收入单价、收入金额、发出单价、发出金额、结存单价、结存金额
								//且将值设置成文本格式  pengy 2013-12-05
								if (value != null &&
										(colName.equalsIgnoreCase("FINI_STOCK_PRICE") || colName.equalsIgnoreCase("FINI_STOCK_MONEY")
										|| colName.equalsIgnoreCase("IN_PRICE") || colName.equalsIgnoreCase("IN_AMOUNT")
										|| colName.equalsIgnoreCase("OUT_PRICE") || colName.equalsIgnoreCase("OUT_AMOUNT")
										|| colName.equalsIgnoreCase("STOCK_PRICE") || colName.equalsIgnoreCase("STOCK_MONEY"))){
									value = String.format("%.2f", (BigDecimal)value);
									dataFormat = setCellValue(hssfCell, "String", value);
								} else {
									dataFormat = setCellValue(hssfCell,bean.getDbType(),value);
								}
								Map<String,String> ctstyleMap = new HashMap<String, String>();
								if(dataFormat!=null) {
									ctstyleMap.put("dataFormat", dataFormat+"");
								}
								//设置单元格样式
								hssfCell.setCellStyle(XMLToExcel.getConfigStyle(wb,stylesMap,ctstyleMap));
							}
							rownum ++;
						}
					}
				}
			}
			ByteArrayOutputStream bos = new ByteArrayOutputStream();
			wb.write(bos);
			bos.flush();
			bos.close();
			return bos;
		}else{
			throw new ExcelPortException("模板文件读取异常！");
		}
	}

	/**
	 * 由bean对象获得数据
	 * @param bean
	 * @return
	 */
	private List<Map<String, Object>> getDataBySheetControlBean(SheetControlBean bean) throws DbPropertyException, SQLException{
		BuildSql sqlHelper = bean.buildSql();
		try {
			DbCon db = new DbCon();
			return db.querySql(sqlHelper) ;
		} catch (DbPropertyException e) {
			throw e;
		} catch (SQLException e) {
			throw new SQLException("sql语句异常！sql:"+sqlHelper.toString());
		}
	}

	/**
	 * 根据单元格类型给单元格赋值
	 * 目前仅处理了以下几种类型：boolean，calendar，date，number。其他都以文本型处理
	 * @param hfcell poi的HSSFCell对象
	 * @param cellType 单元格类型
	 * @param cellValue 单元格值
	 */
	private static Short setCellValue(Cell hfcell, String cellType, Object cellValue) {
		if(cellValue==null){
			return null;
		}
		Short dataFormat = null ; 
		String cell = cellType.trim() ;
		if(cell.equalsIgnoreCase("timestamp")){
			java.sql.Timestamp val = (Timestamp) cellValue ;
			hfcell.setCellValue(val) ;
			dataFormat = HSSFDataFormat.getBuiltinFormat("m/d/yy h:mm") ;
		} else if(cell.equalsIgnoreCase("date")){
			java.sql.Date val = (java.sql.Date) cellValue ;
			Date value = new Date(val.getTime());
			hfcell.setCellValue(value) ;
			
			DateFormat format = new SimpleDateFormat("yyyy-MM-dd");   
			format.format(value) ;
			dataFormat = HSSFDataFormat.getBuiltinFormat("m/d/yy") ;
		} else if(cell.equalsIgnoreCase("number")){
			if(cellValue instanceof Integer) {
				hfcell.setCellValue((Integer)cellValue) ;
			}else if(cellValue instanceof BigDecimal) {
				hfcell.setCellValue(((BigDecimal)cellValue).doubleValue()) ;
			}
		} else {
			RichTextString value = new HSSFRichTextString(com.sgepit.helps.util.StringUtil.objectToString(cellValue)) ;
			hfcell.setCellValue(value) ;
		}
		return dataFormat;
	}

	/**
	 * 物资台账统计值
	 * @param where 查询条件
	 * @return	统计对象及数量1
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public List equGoodsTzStatistic(String where){
		List totalList = new ArrayList();
		EquGoodsTz total = new EquGoodsTz();
		String sumSql = "select NVL(SUM(t.in_num),0),NVL(SUM(t.in_amount),0),NVL(SUM(t.out_num),0)," +
				"NVL(SUM(t.out_amount),0) from equ_goods_tz t where " + where;
		List<Object[]> sum = this.equipmentDAO.getDataAutoCloseSes(sumSql);
		total.setInNum(((BigDecimal)sum.get(0)[0]).doubleValue());//入库数量之和
		total.setInAmount(((BigDecimal)sum.get(0)[1]).doubleValue());//入库金额之和
		total.setOutNum(((BigDecimal)sum.get(0)[2]).doubleValue());//出库数量之和
		total.setOutAmount(((BigDecimal)sum.get(0)[3]).doubleValue());//出库数量之和
		//DANHAO RK在CK前
		String sql = "select t.chbm,t.fini_stock_num,t.fini_stock_money,t.stock_num,t.stock_money,t.in_sub_uids from " +
				"equ_goods_tz t WHERE " + where + " order by IN_SUB_UIDS asc,chbm asc,finished desc,DANHAO DESC,shrq asc,uids asc";
		List<Object[]> list = this.equipmentDAO.getDataAutoCloseSes(sql);
		Double finiNum = 0d;//期初数量累计
		Double finiMoney = 0d;//期初金额累计
		Double stockNum = 0d;//结存数量累计
		Double stockMoney = 0d;//结存金额累计
		
		if (list == null || list.size()==0){
			totalList.add(0);
			return totalList;
		}
		if (list.size() == 1){
			finiNum = ((BigDecimal)list.get(0)[1]).doubleValue();
			finiMoney = ((BigDecimal)list.get(0)[2]).doubleValue();
			stockNum = ((BigDecimal)list.get(0)[3]).doubleValue();
			stockMoney = ((BigDecimal)list.get(0)[4]).doubleValue();
			total.setFiniStockNum(finiNum);
			total.setFiniStockMoney(finiMoney);
			total.setStockNum(stockNum);
			total.setStockMoney(stockMoney);
			totalList.add(total);
			totalList.add(1);
			return totalList;
		}
		String wzbmPrev = "";//前一个物资编码
		for (int i = 0; i < list.size(); i++) {
			Object[] objs=(Object[])list.get(i);
			//入库明细主键或存货编码
			String bm = objs[5] != null ? objs[5].toString() : objs[0] != null ? objs[0].toString() : "";
			if(i == 0){
				finiNum = ((BigDecimal)objs[1]).doubleValue();
				finiMoney = ((BigDecimal)objs[2]).doubleValue();
				String wzbmNext = list.get(i+1)[5] != null ? (String)list.get(i+1)[5] : (String)list.get(i+1)[0];
				if (!bm.equals(wzbmNext)){
					stockNum = ((BigDecimal)objs[3]).doubleValue();
					stockMoney = ((BigDecimal)objs[4]).doubleValue();
				}
				wzbmPrev = bm;
				continue;
			}
			if (i < list.size()-1){
				String wzbmNext = list.get(i+1)[5] != null ? (String)list.get(i+1)[5] : (String)list.get(i+1)[0];
				if (!bm.equals(wzbmPrev)){
					finiNum += ((BigDecimal)objs[1]).doubleValue();
					finiMoney += ((BigDecimal)objs[2]).doubleValue();
				}
				if (!bm.equals(wzbmNext)){
					stockNum += ((BigDecimal)objs[3]).doubleValue();
					stockMoney += ((BigDecimal)objs[4]).doubleValue();
				}
				wzbmPrev = bm;
			} else {//最后一条
				stockNum += ((BigDecimal)objs[3]).doubleValue();
				stockMoney += ((BigDecimal)objs[4]).doubleValue();
				if (!bm.equals(wzbmPrev)){
					finiNum += ((BigDecimal)objs[1]).doubleValue();
					finiMoney += ((BigDecimal)objs[2]).doubleValue();
				}
			}
		}
		DecimalFormat df = new DecimalFormat("#.00");
		total.setFiniStockNum(new Double(df.format(finiNum)));
		total.setFiniStockMoney(new Double(df.format(finiMoney)));
		total.setStockNum(new Double(df.format(stockNum)));
		total.setStockMoney(new Double(df.format(stockMoney)));
		totalList.add(total);
		totalList.add(1);
		return totalList;
	}

	/**
	 * 主体设备正式、暂估出入库完结插入物资台账
	 * @param type 正式入库，暂估入库，冲回入库，正式出库，暂估出库，冲回出库
	 * @param master 主表对象
	 * @param detail 从表对象
	 * @return
	 * @author pengy 2014-08-06
	 */
	@SuppressWarnings("unchecked")
	private String insertEquGoodsTz(String type, Object master, Object detail){
		String rtn = "0";
		List<String> listTz = null;
		String sqlTz = "";
		EquGoodsTz goodsTz = new EquGoodsTz();
		if ("正式入库".equals(type) || "暂估入库".equals(type) || "冲回入库".equals(type)){
			//入库前的库存数量beforeInNum，金额beforeInMoney，单价beforeInPrice
			//现在出库明细改为从入库明细中选择，不再根据存货编码合并物资，故一条入库明细，就是一种物资 pengy 2013-11-07
			EquGoodsStorein in = (EquGoodsStorein)master;
			EquGoodsStoreinSub obj = (EquGoodsStoreinSub)detail;
			goodsTz.setPid(in.getPid());
			goodsTz.setType("ZTSBRK-"+obj.getUids());
			goodsTz.setShrq(new Date());
			goodsTz.setChbm(obj.getStockno());
			goodsTz.setChmc(obj.getWarehouseName());
			goodsTz.setGgxh(obj.getGgxh());
			goodsTz.setDw(obj.getUnit());
			goodsTz.setInNum(obj.getInWarehouseNo());
			goodsTz.setInPrice(obj.getIntoMoney());
			goodsTz.setInAmount(obj.getTotalMoney());
			goodsTz.setOutNum(0d);
			goodsTz.setOutPrice(0d);
			goodsTz.setOutAmount(0d);
			goodsTz.setLlyt("");
			goodsTz.setCwkm("");
			goodsTz.setRiqi(in.getWarehouseDate());
			goodsTz.setDanhao(in.getWarehouseNo());
			goodsTz.setInSubUids(obj.getUids());//入库明细主键
			goodsTz.setEquType(type);//暂估入库或正式入库
			goodsTz.setKks("");
			goodsTz.setAzbw("");
			goodsTz.setFinished(1L);
			//不再合并物资，故期初为0
			goodsTz.setFiniStockNum(0d);
			goodsTz.setFiniStockPrice(0d);
			goodsTz.setFiniStockMoney(0d);
			goodsTz.setStockNum(obj.getInWarehouseNo());
			goodsTz.setStockPrice(obj.getInWarehouseNo() != 0 && obj.getTotalMoney() != 0 ? obj.getIntoMoney() : 0);
			goodsTz.setStockMoney(obj.getTotalMoney());
			
			sqlTz = "select b.wareno FROM equ_warehouse b WHERE b.parent='01' AND b.waretype=" +
					"(SELECT a.waretype from equ_warehouse a where a.equid='"+in.getEquid()+"')";
			listTz = this.equipmentDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setCangkuType(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
			
			sqlTz = "select wareno FROM equ_warehouse b WHERE b.equid='"+in.getEquid()+"'";
			listTz = this.equipmentDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setCangku(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
			
			sqlTz = "SELECT c.DETAIL_TYPE FROM property_code c WHERE c.type_name=(SELECT t.uids FROM " +
					"property_type t WHERE t.type_name='主体设备参与单位') AND c.property_code='"+in.getJoinUnit()+"'";
			listTz = this.equipmentDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setKczz(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
			
			sqlTz = "SELECT C.CONNO FROM CON_OVE C WHERE C.CONID='"+in.getConid()+"'";
			listTz = this.equipmentDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setConno(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
			
			sqlTz = "SELECT B.PARTYB FROM CON_PARTYB B WHERE B.CPID=(SELECT C.PARTYBNO FROM CON_OVE C WHERE C.CONID='"+in.getConid()+"')";
			listTz = this.equipmentDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setGhdw(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
			
			sqlTz = "SELECT U.REALNAME FROM ROCK_USER U WHERE U.USERID='"+in.getCreateMan()+"'";
			listTz = this.equipmentDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setZdr(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
			
			sqlTz = "SELECT U.REALNAME FROM ROCK_USER U WHERE U.USERID='"+this.getCurrentUserid()+"'";
			listTz = this.equipmentDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setShr(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
			
			sqlTz = "select t.property_name AS NAME from PROPERTY_CODE t where t.type_name=(select u.uids from PROPERTY_TYPE u" +
					" where u.type_name='设备合同树分类') AND t.property_code=(SELECT E.TREENAME FROM EQU_TYPE_TREE E WHERE" +
					" E.Treename IN ('2','3') AND E.UUID='" + in.getTreeuids() + "')";
			listTz = this.equipmentDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setConttreetype(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
		} else if ("正式出库".equals(type) || "暂估出库".equals(type) || "冲回出库".equals(type)){
			//由于出库单明细从入库单明细中选择，且不改变库存，导致库存中数据错误
			//现在改为直接查询入库明细，获得入库数量，入库金额，查询出库明细中此物资总出库数量，出库金额  pengy 2013-11-5
			EquGoodsStockOut out = (EquGoodsStockOut)master;
			EquGoodsStockOutSub obj = (EquGoodsStockOutSub)detail;
			EquGoodsStoreinSub storeinSub = (EquGoodsStoreinSub) this.equipmentDAO.findById(
					EquGoodsStoreinSub.class.getName(), obj.getInSubUids());
			Double storeinNum = 0d;//入库数量
			Double storeinMoney = 0d;//入库金额
			if (storeinSub != null){
				storeinNum = storeinSub.getInWarehouseNo() == null ? 0d : storeinSub.getInWarehouseNo();
				storeinMoney = storeinSub.getTotalMoney() == null ? 0d : storeinSub.getTotalMoney();
			}
			String outSql = "select NVL(SUM(t.out_num),0),NVL(SUM(t.amount),0) from equ_goods_stock_out_sub" +
					" t where t.in_sub_uids='" + obj.getInSubUids() + "'";
			List<Object[]> outSum = this.equipmentDAO.getDataAutoCloseSes(outSql);
			Double stockoutNum = 0d;//出库总数量
			Double stockoutMoney = 0d;//出库总金额
			if (outSum != null && outSum.size()>0){
				stockoutNum = ((BigDecimal)outSum.get(0)[0]).doubleValue();
				stockoutMoney = ((BigDecimal)outSum.get(0)[1]).doubleValue();
			}
			//出库后的库存数量afterOutNum，金额afterOutMoney，单价afterOutPrice
			Double afterOutNum = storeinNum - stockoutNum;
			Double afterOutMoney = storeinMoney - stockoutMoney;
			Double afterOutPrice = obj.getPrice() == null ? 0d : obj.getPrice();
			
			goodsTz.setPid(out.getPid());
			goodsTz.setType("ZTSBCK-"+obj.getUids());
			goodsTz.setShrq(new Date());
			goodsTz.setChbm(obj.getBoxNo());
			goodsTz.setChmc(obj.getEquPartName());
			goodsTz.setGgxh(obj.getGgxh());
			goodsTz.setDw(obj.getUnit());
			goodsTz.setInNum(0d);
			goodsTz.setInPrice(0d);
			goodsTz.setInAmount(0d);
			goodsTz.setOutNum(obj.getOutNum());
			goodsTz.setOutPrice(obj.getPrice());
			goodsTz.setOutAmount(obj.getAmount());
			goodsTz.setCwkm(out.getFinancialSubjects());
			goodsTz.setRiqi(out.getOutDate());
			goodsTz.setDanhao(out.getOutNo());
			goodsTz.setInSubUids(obj.getInSubUids());//入库明细主键
			goodsTz.setEquType(type);//暂估出库或正式出库
			goodsTz.setKks(obj.getKksNo());
			goodsTz.setAzbw(obj.getUseParts());
			goodsTz.setFinished(1L);
			//期初、结存
			if ("冲回出库".equals(type)){
				goodsTz.setFiniStockNum(afterOutNum);
				goodsTz.setFiniStockPrice(afterOutPrice);
				goodsTz.setFiniStockMoney(afterOutMoney);
				goodsTz.setStockNum(afterOutNum - obj.getOutNum());
				goodsTz.setStockPrice(afterOutPrice);
				goodsTz.setStockMoney(afterOutMoney - obj.getAmount());
			} else {
				goodsTz.setFiniStockNum(afterOutNum + obj.getOutNum());
				goodsTz.setFiniStockPrice(afterOutPrice);
				goodsTz.setFiniStockMoney(afterOutMoney + obj.getAmount());
				goodsTz.setStockNum(afterOutNum);
				goodsTz.setStockPrice(afterOutPrice);
				goodsTz.setStockMoney(afterOutMoney);
			}
			
			sqlTz = "select b.bdgname||' - '||b.bdgid FROM bdg_info b WHERE b.bdgid='"+out.getUsing()+"'";
			listTz = this.equipmentDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setLlyt(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
			
			sqlTz = "select (select b.wareno FROM equ_warehouse b WHERE b.parent='01' AND b.waretype=" +
					"a.waretype) wareparent FROM equ_warehouse a WHERE a.equid='"+out.getEquid()+"'";
			listTz = this.equipmentDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setCangkuType(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
			
			sqlTz = "select wareno FROM equ_warehouse b WHERE b.equid='"+out.getEquid()+"'";
			listTz = this.equipmentDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setCangku(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
			
			sqlTz = "SELECT c.property_name FROM property_code c WHERE c.type_name=(SELECT t.uids FROM " +
					"property_type t WHERE t.type_name='领用单位') AND c.property_code='"+out.getRecipientsUnit()+"'";
			listTz = this.equipmentDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setKczz(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
			
			sqlTz = "SELECT C.CONNO FROM CON_OVE C WHERE C.CONID='"+out.getConid()+"'";
			listTz = this.equipmentDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setConno(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
			
			sqlTz = "SELECT B.PARTYB FROM CON_PARTYB B WHERE B.CPID=(SELECT C.PARTYBNO FROM CON_OVE C WHERE C.CONID='"+out.getConid()+"')";
			listTz = this.equipmentDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setGhdw(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
			
			sqlTz = "SELECT U.REALNAME FROM ROCK_USER U WHERE U.USERID='"+out.getCreateMan()+"'";
			listTz = this.equipmentDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setZdr(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
			
			sqlTz = "SELECT U.REALNAME FROM ROCK_USER U WHERE U.USERID='"+this.getCurrentUserid()+"'";
			listTz = this.equipmentDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setShr(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
			
			sqlTz = "select t.property_name AS NAME from PROPERTY_CODE t where t.type_name=(select u.uids from PROPERTY_TYPE u" +
					" where u.type_name='设备合同树分类') AND t.property_code=(SELECT E.TREENAME FROM EQU_TYPE_TREE E WHERE" +
					" E.Treename IN ('2','3') AND E.UUID='" + out.getTreeuids() + "')";
			listTz = this.equipmentDAO.getDataAutoCloseSes(sqlTz);
			goodsTz.setConttreetype(listTz != null && listTz.size() > 0 ? listTz.get(0) : "");
		}
		this.equipmentDAO.insert(goodsTz);
		return rtn;
	}

	/**
	 * 导出月度统计台账
	 * @param map1	查询条件
	 * @param wb	工作簿
	 * @return Excel输出流
	 * @author pengy 2014-08-08
	 */
	@SuppressWarnings("unchecked")
	public ByteArrayOutputStream fillDataToMonthTotalTzExcel(Workbook wb, Map<String, String> map1) throws DbPropertyException, SQLException, IOException, ExcelPortException {
		if(wb!=null) {
			HashMap<String,CellStyle> stylesMap = new HashMap<String,CellStyle>();//样式map，存放各种样式
			int sheetNumber = wb.getNumberOfSheets(); // 获得总sheet数
			for (int i = 0; i < sheetNumber; i++) {
				Sheet sheet = wb.getSheetAt(i);
				//获取数据,分主体设备，主体材料，备品备件，专用工具
				List<Map<String, Object>> sbTz = JdbcUtil.query("SELECT T.TYPE,T.EQU_TYPE,T.IN_SUB_UIDS,T.CHBM,T.FINI_STOCK_MONEY,T.IN_AMOUNT," +
						"T.OUT_AMOUNT,T.STOCK_MONEY FROM EQU_GOODS_TZ T WHERE (T.FINISHED IS NULL OR T.FINISHED=1) AND T.TYPE LIKE 'ZTSB%' AND" +
						" CONTTREETYPE IS NULL AND " + map1.get("exportFilter") + " ORDER BY T.IN_SUB_UIDS ASC,T.CHBM ASC,T.SHRQ ASC");
				List<Map<String, Object>> clTz = JdbcUtil.query("SELECT T.TYPE,T.EQU_TYPE,T.IN_SUB_UIDS,T.CHBM,T.FINI_STOCK_MONEY,T.IN_AMOUNT," +
						"T.OUT_AMOUNT,T.STOCK_MONEY FROM EQU_GOODS_TZ T WHERE (T.FINISHED IS NULL OR T.FINISHED=1) AND T.TYPE LIKE 'ZTCL%' AND" +
						" CONTTREETYPE IS NULL AND " + map1.get("exportFilter") + " ORDER BY T.IN_SUB_UIDS ASC,T.CHBM ASC,T.SHRQ ASC");
				List<Map<String, Object>> bpbjTz = JdbcUtil.query("SELECT T.TYPE,T.EQU_TYPE,T.IN_SUB_UIDS,T.CHBM,T.FINI_STOCK_MONEY,T.IN_AMOUNT," +
						"T.OUT_AMOUNT,T.STOCK_MONEY FROM EQU_GOODS_TZ T WHERE (T.FINISHED IS NULL OR T.FINISHED=1) AND CONTTREETYPE='备品备件' AND " +
						map1.get("exportFilter") + " ORDER BY T.IN_SUB_UIDS ASC,T.CHBM ASC,T.SHRQ ASC");
				List<Map<String, Object>> azgjTz = JdbcUtil.query("SELECT T.TYPE,T.EQU_TYPE,T.IN_SUB_UIDS,T.CHBM,T.FINI_STOCK_MONEY,T.IN_AMOUNT," +
						"T.OUT_AMOUNT,T.STOCK_MONEY FROM EQU_GOODS_TZ T WHERE (T.FINISHED IS NULL OR T.FINISHED=1) AND CONTTREETYPE='专用工具' AND " +
						map1.get("exportFilter") + " ORDER BY T.IN_SUB_UIDS ASC,T.CHBM ASC,T.SHRQ ASC");
				List<EquGoodsTzMonthTotal> tzMonths = new ArrayList<EquGoodsTzMonthTotal>();
				tzMonths.add(getEquGoodsTzMonthTotal(sbTz, "ZTSB"));
				tzMonths.add(getEquGoodsTzMonthTotal(clTz, "ZTCL"));
				tzMonths.add(getEquGoodsTzMonthTotal(bpbjTz, "BPBJ"));
				tzMonths.add(getEquGoodsTzMonthTotal(azgjTz, "AZGJ"));
				
				if(tzMonths!=null) {
					int rownum = 3;
					for(int j=0; j<tzMonths.size(); j++) {
						EquGoodsTzMonthTotal tzMonth = tzMonths.get(j);
						Row hssfRow = sheet.getRow(rownum);
						if(hssfRow==null) {
							hssfRow = sheet.createRow(rownum);
						}
						for(int k=1; k<13; k++) {
							if (k==6 || k==9){
								continue;
							}
							Cell hssfCell = hssfRow.getCell(k);
							if(hssfCell==null) {
								hssfCell = hssfRow.createCell(k);
							}
							Short dataFormat = null;
							double value = 0d;
							if (k==1){
								value = tzMonth.getFiniStockMoney();
							} else if (k==3){
								value = tzMonth.getZsInAmount();
							} else if (k==4){
								value = tzMonth.getZgInAmount();
							} else if (k==5){
								value = tzMonth.getChInAmount();
							} else if (k==7){
								value = tzMonth.getZsInAmount() + tzMonth.getZgInAmount() + tzMonth.getChInAmount();
							} else if (k==8 || k==10){
								value = tzMonth.getOutAmount();
							} else if (k==11){
								value = tzMonth.getStockMoney();
							} else if (k==12){
								value = tzMonth.getZgInAmount() - tzMonth.getChInAmount();
							}
							//四舍五入保留小数点后两位，不足的补0，且将值设置成文本格式  pengy 2013-12-05
							dataFormat = setCellValue(hssfCell, "String", String.format("%.2f", new BigDecimal(value)));
							Map<String,String> ctstyleMap = new HashMap<String, String>();
							if(dataFormat!=null) {
								ctstyleMap.put("dataFormat", dataFormat+"");
							}
							//设置单元格样式
							hssfCell.setCellStyle(XMLToExcel.getConfigStyle(wb,stylesMap,ctstyleMap));
						}
						rownum ++;
					}
				}
			}
			ByteArrayOutputStream bos = new ByteArrayOutputStream();
			wb.write(bos);
			bos.flush();
			bos.close();
			return bos;
		}else{
			throw new ExcelPortException("模板文件读取异常！");
		}
	}

	/**
	 * 统计出台账月度汇总表
	 * @param dataList 查询的数据集合
	 * @param type 出入库类型
	 * @return
	 * @author pengy 2014-08-08
	 */
	private EquGoodsTzMonthTotal getEquGoodsTzMonthTotal(List<Map<String, Object>> dataList, String type){
		EquGoodsTzMonthTotal tzMonth = new EquGoodsTzMonthTotal();
		double finiStockMoney = 0d;//期初金额累计
		double zgFiniStockMoney = 0d;//暂估入库期初
		double zsInAmount = 0d;//正式入库收入金额
		double zgInAmount = 0d;//暂估入库收入金额
		double chInAmount = 0d;//冲回入库收入金额
		double outAmount = 0d;//发出金额累计
		double stockMoney = 0d;//结存金额累计
		if (dataList != null && dataList.size()>0){
			String wzbmPrev = "";
			for (int i=0; i<dataList.size(); i++){
				Map<String, Object> dataMap = dataList.get(i);
				//入库明细主键或存货编码
				String bm = dataMap.get("IN_SUB_UIDS") != null ? (String)dataMap.get("IN_SUB_UIDS")
						: dataMap.get("CHBM") != null ? (String)dataMap.get("CHBM") : "";
				String equType = (String)dataMap.get("EQU_TYPE");
				double inMount = ((BigDecimal)dataMap.get("IN_AMOUNT")).doubleValue();
				if ("正式入库".equals(equType)){
					zsInAmount += inMount;
				} else if ("暂估入库".equals(equType)){
					zgInAmount += inMount;
				} else if ("冲回入库".equals(equType)){
					chInAmount += inMount;
				}
				outAmount += ((BigDecimal)dataMap.get("OUT_AMOUNT")).doubleValue();
				if(i == 0){
					finiStockMoney = ((BigDecimal)dataMap.get("FINI_STOCK_MONEY")).doubleValue();
					stockMoney = ((BigDecimal)dataMap.get("STOCK_MONEY")).doubleValue();
					if (dataList.size()>1){
						String wzbmNext = dataList.get(1).get("IN_SUB_UIDS") != null ? (String)dataList.get(1).get("IN_SUB_UIDS")
								: (String)dataMap.get("CHBM") != null ? (String)dataMap.get("CHBM") : "";
						if (bm.equals(wzbmNext)){
							stockMoney = 0d;
						}
					}
					wzbmPrev = bm;
					continue;
				}
				if (i < dataList.size()-1){
					String wzbmNext = dataList.get(i+1).get("IN_SUB_UIDS") != null ? (String)dataList.get(i+1).get("IN_SUB_UIDS")
							: (String)dataMap.get("CHBM") != null ? (String)dataMap.get("CHBM") : "";
					if (!bm.equals(wzbmPrev)){
						finiStockMoney += ((BigDecimal)dataMap.get("FINI_STOCK_MONEY")).doubleValue();
					}
					if (!bm.equals(wzbmNext)){
						stockMoney += ((BigDecimal)dataMap.get("STOCK_MONEY")).doubleValue();
					}
					wzbmPrev = bm;
				} else {//最后一条
					stockMoney += ((BigDecimal)dataMap.get("STOCK_MONEY")).doubleValue();
					if (!bm.equals(wzbmPrev)){
						finiStockMoney += ((BigDecimal)dataMap.get("FINI_STOCK_MONEY")).doubleValue();
					}
				}
			}
		}
		DecimalFormat df = new DecimalFormat("#.00");
		tzMonth.setFiniStockMoney(new Double(df.format(finiStockMoney)));
		tzMonth.setZsInAmount(new Double(df.format(zsInAmount)));
		tzMonth.setZgInAmount(new Double(df.format(zgInAmount)));
		tzMonth.setChInAmount(new Double(df.format(chInAmount)));
		tzMonth.setOutAmount(new Double(df.format(outAmount)));
		tzMonth.setStockMoney(new Double(df.format(stockMoney)));
		tzMonth.setZgFiniStockMoney(new Double(df.format(zgFiniStockMoney)));
		tzMonth.setType(type);
		return tzMonth;
	}

}