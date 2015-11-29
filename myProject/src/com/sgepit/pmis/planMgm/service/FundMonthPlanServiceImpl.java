/**
 * 
 */
package com.sgepit.pmis.planMgm.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;

import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.RichTextString;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

import oracle.sql.BLOB;

import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.util.JNDIUtil;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.helps.excelService.ColumnControlBean;
import com.sgepit.helps.excelService.ExcelToXML;
import com.sgepit.helps.excelService.XMLToExcel;
import com.sgepit.helps.util.StringUtil;
import com.sgepit.helps.webdynproService.export.ExcelPortException;
import com.sgepit.pmis.contract.hbm.ConOve;
import com.sgepit.pmis.contract.hbm.ConOveView;
import com.sgepit.pmis.contract.hbm.ConPartyb;
import com.sgepit.pmis.planMgm.dao.FundMonthPlanDAO;
import com.sgepit.pmis.planMgm.hbm.ConReportBean;
import com.sgepit.pmis.planMgm.hbm.FundMonthPlanD;
import com.sgepit.pmis.planMgm.hbm.FundMonthPlanM;

/**
 * @author qiupy 2014-3-4 
 * 月度资金计划管理
 */
public class FundMonthPlanServiceImpl extends BaseMgmImpl implements FundMonthPlanService{

	public FundMonthPlanDAO fundMonthPlanDAO;

	public FundMonthPlanDAO getFundMonthPlanDAO() {
		return fundMonthPlanDAO;
	}

	public void setFundMonthPlanDAO(FundMonthPlanDAO fundMonthPlanDAO) {
		this.fundMonthPlanDAO = fundMonthPlanDAO;
	}
	
	/**
	 * 
	* @Title: buildConReportTreeGrid
	* @Description:  构造月度资金计划明细树
	* @param orderBy
	* @param start
	* @param limit
	* @param map
	* @return   
	* @return List    
	* @throws
	* @author qiupy 2014-3-5
	 */
	public List<ConReportBean> buildConReportTreeGrid(String orderBy, Integer start, Integer limit, HashMap params) {
		List<ConReportBean> list = new ArrayList<ConReportBean>();
		String parentId = (String) params.get("parent");
		String reportId= (String) params.get("reportId");
		if(reportId!=null&&reportId.length()>0){
			if("0".equals(parentId)){
				ConReportBean cb = new ConReportBean();
				cb.setReportId(reportId);
				cb.setUids("01");
				cb.setParent("0");
				cb.setIsleaf(0L);
				cb.setConid("01");
				cb.setCondivno("01");
				cb.setContypename("合&nbsp;计");
				list.add(cb);
			}else if ("01".equals(parentId)) {
	//			获取合同分类
				ConReportBean cb = new ConReportBean();
				String conTypeSql = "select m.* from property_code m, property_type t where m.type_name = t.uids  and t.type_name = '合同划分类型'";
				List typeList = fundMonthPlanDAO.getDataAutoCloseSes(conTypeSql);
				int num=0;
				for (int i = 0; i < typeList.size(); i++) {
					Object[] objs = (Object[]) typeList.get(i);
					String condivno = (String) objs[1];
					ConReportBean crb = new ConReportBean();
					crb.setConid(condivno);
					crb.setParent("01");
					crb.setReportId(reportId);
					crb.setUids(condivno);
					crb.setCondivno(condivno);
					List listCon = fundMonthPlanDAO.findByWhere(FundMonthPlanD.class.getName(), "condivno='" + condivno +"' and reportId='"+reportId+"'");
					crb.setContypename((String) objs[3]+"(" + listCon.size() + ")");
					num+=listCon.size();
					if (listCon.size() > 0) {
						crb.setIsleaf(0L);
						for(int m=0;m<listCon.size();m++){
							FundMonthPlanD fundMonthPlanD = (FundMonthPlanD) listCon.get(m);
							crb.setConvaluemoney(crb.getConvaluemoney()==null?fundMonthPlanD.getConvaluemoney():add(crb.getConvaluemoney(),fundMonthPlanD.getConvaluemoney()));
							crb.setConpay(crb.getConpay()==null?fundMonthPlanD.getConpay():add(crb.getConpay(),fundMonthPlanD.getConpay()));
							crb.setPredictPayment1(crb.getPredictPayment1()==null?fundMonthPlanD.getPredictPayment1():add(crb.getPredictPayment1(),fundMonthPlanD.getPredictPayment1()));
							crb.setPredictPayment2(crb.getPredictPayment2()==null?fundMonthPlanD.getPredictPayment2():add(crb.getPredictPayment2(),fundMonthPlanD.getPredictPayment2()));
							crb.setPredictPayment3(crb.getPredictPayment3()==null?fundMonthPlanD.getPredictPayment3():add(crb.getPredictPayment3(),fundMonthPlanD.getPredictPayment3()));
						}
					} else {
						crb.setIsleaf(1L);
						crb.setConvaluemoney(0d);
						crb.setConpay(0d);
						crb.setPredictPayment1(0d);
						crb.setPredictPayment2(0d);
						crb.setPredictPayment3(0d);
					}
					list.add(crb);
					cb.setConvaluemoney(cb.getConvaluemoney()==null?crb.getConvaluemoney():add(cb.getConvaluemoney(),crb.getConvaluemoney()));
					cb.setConpay(cb.getConpay()==null?crb.getConpay():add(cb.getConpay(),crb.getConpay()));
					cb.setPredictPayment1(cb.getPredictPayment1()==null?crb.getPredictPayment1():add(cb.getPredictPayment1(),crb.getPredictPayment1()));
					cb.setPredictPayment2(cb.getPredictPayment2()==null?crb.getPredictPayment2():add(cb.getPredictPayment2(),crb.getPredictPayment2()));
					cb.setPredictPayment3(cb.getPredictPayment3()==null?crb.getPredictPayment3():add(cb.getPredictPayment3(),crb.getPredictPayment3()));
				}
				cb.setReportId(reportId);
				cb.setUids("ALL");
				cb.setParent("01");
				cb.setIsleaf(1L);
				cb.setConid("ALL");
				cb.setCondivno("ALL");
				cb.setContypename("合&nbsp;计"+"("+num+")");
				list.add(cb);
			} else {
				List<ConReportBean> list1 = new ArrayList<ConReportBean>();
				List listCon = fundMonthPlanDAO.findByWhere(FundMonthPlanD.class.getName(), "condivno='" + parentId + "'  and reportId='"+reportId+"'");
				for (int m = 0; m < listCon.size(); m++) {
					FundMonthPlanD fundMonthPlanD = (FundMonthPlanD) listCon.get(m);
					ConOve con=(ConOve) fundMonthPlanDAO.findById(ConOve.class.getName(), fundMonthPlanD.getConid());
					ConReportBean cb = new ConReportBean();
					cb.setReportId(reportId);
					cb.setUids(fundMonthPlanD.getUids());
					cb.setParent(parentId);
					cb.setIsleaf(1L);
					cb.setConid(fundMonthPlanD.getConid());
					cb.setContypename(con.getConname());
					cb.setCondivno(parentId);
					cb.setConvaluemoney(fundMonthPlanD.getConvaluemoney());
					cb.setConpay(fundMonthPlanD.getConpay());
					cb.setPredictPayment1(fundMonthPlanD.getPredictPayment1());
					cb.setPredictPayment2(fundMonthPlanD.getPredictPayment2());
					cb.setPredictPayment3(fundMonthPlanD.getPredictPayment3());
					cb.setBatch(fundMonthPlanD.getBatch());
					cb.setConno(fundMonthPlanD.getConno());
					cb.setRemark(fundMonthPlanD.getRemark());
					cb.setPartybno(fundMonthPlanD.getPartybno());
					list1.add(cb);
				}
				return list1;
			}
		}
		return list;
	}
	/**
	 * 
	* @Title: buildConReportTreeGrid
	* @Description:  构造月度资金计划明细导出
	* @param orderBy
	* @param start
	* @param limit
	* @param map
	* @return   
	* @return List    
	* @throws
	* @author qiupy 2014-3-5
	 */
	public List<ConReportBean> buildConReportExportData(String reportId) {
		List<ConReportBean> list = new ArrayList<ConReportBean>();
		if(reportId!=null&&reportId.length()>0){
	//			获取合同分类
			ConReportBean cb = new ConReportBean();
			String conTypeSql = "select m.* from property_code m, property_type t where m.type_name = t.uids  and t.type_name = '合同划分类型'";
			List typeList = fundMonthPlanDAO.getDataAutoCloseSes(conTypeSql);
			int num=0;
			for (int i = 0; i < typeList.size(); i++) {
				Object[] objs = (Object[]) typeList.get(i);
				String condivno = (String) objs[1];
				ConReportBean crb = new ConReportBean();
				crb.setConid(condivno);
				crb.setParent("0");
				crb.setReportId(reportId);
				crb.setUids(condivno);
				crb.setCondivno(condivno);
				List listCon = fundMonthPlanDAO.findByWhere(FundMonthPlanD.class.getName(), "condivno='" + condivno +"' and reportId='"+reportId+"'");
				crb.setContypename((String) objs[3]+"(" + listCon.size() + ")");
				num+=listCon.size();
				List<ConReportBean> list1 = new ArrayList<ConReportBean>();
				if (listCon.size() > 0) {
					crb.setIsleaf(0L);
					for(int m=0;m<listCon.size();m++){
						FundMonthPlanD fundMonthPlanD = (FundMonthPlanD) listCon.get(m);
						crb.setConvaluemoney(crb.getConvaluemoney()==null?fundMonthPlanD.getConvaluemoney():add(crb.getConvaluemoney(),fundMonthPlanD.getConvaluemoney()));
						crb.setConpay(crb.getConpay()==null?fundMonthPlanD.getConpay():add(crb.getConpay(),fundMonthPlanD.getConpay()));
						crb.setPredictPayment1(crb.getPredictPayment1()==null?fundMonthPlanD.getPredictPayment1():add(crb.getPredictPayment1(),fundMonthPlanD.getPredictPayment1()));
						crb.setPredictPayment2(crb.getPredictPayment2()==null?fundMonthPlanD.getPredictPayment2():add(crb.getPredictPayment2(),fundMonthPlanD.getPredictPayment2()));
						crb.setPredictPayment3(crb.getPredictPayment3()==null?fundMonthPlanD.getPredictPayment3():add(crb.getPredictPayment3(),fundMonthPlanD.getPredictPayment3()));
						ConOve con=(ConOve) fundMonthPlanDAO.findById(ConOve.class.getName(), fundMonthPlanD.getConid());
						ConPartyb partb=(ConPartyb) fundMonthPlanDAO.findById(ConPartyb.class.getName(), fundMonthPlanD.getPartybno());
						ConReportBean cbf = new ConReportBean();
						cbf.setReportId(reportId);
						cbf.setUids(fundMonthPlanD.getUids());
						cbf.setParent(condivno);
						cbf.setIsleaf(1L);
						cbf.setConid(fundMonthPlanD.getConid());
						cbf.setContypename(con.getConname());
						cbf.setCondivno(condivno);
						cbf.setConvaluemoney(fundMonthPlanD.getConvaluemoney());
						cbf.setConpay(fundMonthPlanD.getConpay());
						cbf.setPredictPayment1(fundMonthPlanD.getPredictPayment1());
						cbf.setPredictPayment2(fundMonthPlanD.getPredictPayment2());
						cbf.setPredictPayment3(fundMonthPlanD.getPredictPayment3());
						cbf.setBatch(fundMonthPlanD.getBatch());
						cbf.setConno(fundMonthPlanD.getConno());
						cbf.setRemark(fundMonthPlanD.getRemark());
						cbf.setPartybno(partb.getPartyb());
						list1.add(cbf);
					}
				} else {
					crb.setIsleaf(1L);
					crb.setConvaluemoney(0d);
					crb.setConpay(0d);
					crb.setPredictPayment1(0d);
					crb.setPredictPayment2(0d);
					crb.setPredictPayment3(0d);
				}
				list.add(crb);
				if (list1.size() > 0) {
					list.addAll(list1);
				}
				cb.setConvaluemoney(cb.getConvaluemoney()==null?crb.getConvaluemoney():add(cb.getConvaluemoney(),crb.getConvaluemoney()));
				cb.setConpay(cb.getConpay()==null?crb.getConpay():add(cb.getConpay(),crb.getConpay()));
				cb.setPredictPayment1(cb.getPredictPayment1()==null?crb.getPredictPayment1():add(cb.getPredictPayment1(),crb.getPredictPayment1()));
				cb.setPredictPayment2(cb.getPredictPayment2()==null?crb.getPredictPayment2():add(cb.getPredictPayment2(),crb.getPredictPayment2()));
				cb.setPredictPayment3(cb.getPredictPayment3()==null?crb.getPredictPayment3():add(cb.getPredictPayment3(),crb.getPredictPayment3()));
			}
			cb.setReportId(reportId);
			cb.setUids("ALL");
			cb.setParent("0");
			cb.setIsleaf(1L);
			cb.setConid("ALL");
			cb.setCondivno("ALL");
			cb.setContypename("合计"+"("+num+")");
			list.add(cb);
		}
		return list;
	}
	/**
	 * 
	* @Title: insertFundMonthPlanD
	* @Description: 新增月度资金计划明细
	* @param selectConidStr 选择合同主键字符串
	* @param reportId  报表主键
	* @param pid  项目id
	* @param preMonth  前一月份
	* @return   
	* @return String    
	* @throws
	* @author qiupy 2014-3-5
	 */
	public String insertFundMonthPlanD(String selectConidStr,String reportId,String pid,String preMonth){
		if(selectConidStr!=null&&selectConidStr.length()>0){
			List<ConOveView> list=fundMonthPlanDAO.findByWhere(ConOveView.class.getName(), "conid in("+selectConidStr+") and pid='"+pid+"'");
			if(list!=null&&list.size()>0){
				for(int i=0;i<list.size();i++){
					ConOveView conOveView=list.get(i);
					String conid=conOveView.getConid();
					FundMonthPlanD fundMonthPlanD=new FundMonthPlanD();
					fundMonthPlanD.setReportId(reportId);
					fundMonthPlanD.setCondivno(conOveView.getCondivno());
					fundMonthPlanD.setConid(conid);
					fundMonthPlanD.setConno(conOveView.getConno());
					fundMonthPlanD.setPartybno(conOveView.getPartybno());
					fundMonthPlanD.setConvaluemoney(cnMoneyToPrec(conOveView.getConvaluemoney(),4,"W"));
					fundMonthPlanD.setConpay(cnMoneyToPrec(conOveView.getConpay(),4,"W"));
					List list1=fundMonthPlanDAO.findByWhere(FundMonthPlanM.class.getName(), "sjType='"+preMonth+"' and pid='"+pid+"'");
					if(list1!=null&&list1.size()==1){
						FundMonthPlanM fundMonthPlanM=(FundMonthPlanM) list1.get(0);
						String preMasterId=fundMonthPlanM.getUids();
						List list2=fundMonthPlanDAO.findByWhere(FundMonthPlanD.class.getName(), "conid='"+conid+"' and reportId='"+preMasterId+"'");
						if(list2!=null&&list2.size()==1){
							FundMonthPlanD prefundMonthPlanD=(FundMonthPlanD) list2.get(0);
							fundMonthPlanD.setPredictPayment1(prefundMonthPlanD.getPredictPayment2()==null?0d:prefundMonthPlanD.getPredictPayment2());
							fundMonthPlanD.setPredictPayment2(prefundMonthPlanD.getPredictPayment3()==null?0d:prefundMonthPlanD.getPredictPayment3());
							fundMonthPlanD.setPredictPayment3(0d);
						}else{
							fundMonthPlanD.setPredictPayment1(0d);
							fundMonthPlanD.setPredictPayment2(0d);
							fundMonthPlanD.setPredictPayment3(0d);
						}
					}else{
						fundMonthPlanD.setPredictPayment1(0d);
						fundMonthPlanD.setPredictPayment2(0d);
						fundMonthPlanD.setPredictPayment3(0d);
					}
					fundMonthPlanDAO.insert(fundMonthPlanD);
				}
			}
		}
		return "ok";
	}
	/**
	 * 
	* @Title: deleteFundMonthDPlanById
	* @Description: 删除月度资金计划明细
	* @param uids
	* @return   
	* @return String    
	* @throws
	* @author qiupy 2014-3-6
	 */
	public String deleteFundMonthDPlanById(String uids){
		if(uids!=null){
			FundMonthPlanD fundMonthPlanD=(FundMonthPlanD) fundMonthPlanDAO.findById(FundMonthPlanD.class.getName(), uids);
			fundMonthPlanDAO.delete(fundMonthPlanD);
			
		}
		return "ok";
	}
	/**
	 * 
	* @Title: getSelectedConidStr
	* @Description: 获取本月已经添加到明细的合同id
	* @param reportId
	* @return   
	* @return String    
	* @throws
	* @author qiupy 2014-3-5
	 */
	public String getSelectedConidStr(String reportId){
		String selectConidStr="";
		List list=fundMonthPlanDAO.findByWhere(FundMonthPlanD.class.getName(), "reportId='"+reportId+"'");
		if(list!=null&&list.size()>0){
			for(int i=0;i<list.size();i++){
				FundMonthPlanD fundMonthPlanD=(FundMonthPlanD) list.get(i);
				selectConidStr+=",'"+fundMonthPlanD.getConid()+"'";
			}
			selectConidStr=selectConidStr.substring(1);
		}
		return selectConidStr;
	}
	/**
	 * 
	* @Title: updatefundMonthPlanD
	* @Description: 修改明细记录
	* @param fundMonthPlanD
	* @return   
	* @return String    
	* @throws
	* @author qiupy 2014-3-5
	 */
	public String updatefundMonthPlanD(FundMonthPlanD fundMonthPlanD){
		if(fundMonthPlanD!=null){
			fundMonthPlanD.setPredictPayment1(cnMoneyToPrec(fundMonthPlanD.getPredictPayment1(),4,"R"));
			fundMonthPlanD.setPredictPayment2(cnMoneyToPrec(fundMonthPlanD.getPredictPayment2(),4,"R"));
			fundMonthPlanD.setPredictPayment3(cnMoneyToPrec(fundMonthPlanD.getPredictPayment3(),4,"R"));
			fundMonthPlanDAO.saveOrUpdate(fundMonthPlanD);
		}
		return "ok";
	}
	/**
	 * 
	* @Title: cnMoneyToPrec
	* @Description: 金额单位修改为“万元”或亿元，小数点后保留2位
	* @param d 需要转化的数值
	* @param prec 保留位数
	* @param type  需要转化的类型
	* @return   
	* @return String    
	* @throws
	* @author qiupy 2014-3-1
	 */
	public Double cnMoneyToPrec(Double d,int prec,String type){
		String stuffix="";
		for(int i=0;i<prec;i++){
			stuffix+="#";
		}
		int typeValue=type.equals("R")?1:(type.equals("W")?10000:100000000);
		String format=stuffix.length()>0?"##0."+stuffix:"##0";
		BigDecimal value=d==null?new BigDecimal(0):new BigDecimal(d).divide(
				new BigDecimal(typeValue), prec, BigDecimal.ROUND_HALF_UP);
		DecimalFormat df = new DecimalFormat(format);
		String fmt =df.format(value);
		return Double.valueOf(fmt);
	}
	/**
	 * 
	* @Title: getExcelTemplate
	* @Description: 获取导出模板
	* @param businessType
	* @return   
	* @return InputStream    
	* @throws
	* @author qiupy 2014-3-6
	 */
	public InputStream getExcelTemplate(String businessType) {
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
	 * 
	* @Title: exportFundData
	* @Description: 导出月度资金计划明细
	* @param sjType
	* @param unitId
	* @param businessType
	* @param reportId
	* @return
	* @throws IOException
	* @throws ExcelPortException   
	* @return ByteArrayOutputStream    
	* @throws
	* @author qiupy 2014-3-6
	 */
	public ByteArrayOutputStream exportFundData(String sjType,String unitId,String businessType,String reportId) throws IOException, ExcelPortException{
		ByteArrayOutputStream bos = null;
		InputStream templateIn = getExcelTemplate(businessType);
		Workbook wb=null;
		if(templateIn!=null){
			try {
				wb = new HSSFWorkbook(templateIn) ;
				if(wb!=null) {
					Sheet sheet = wb.getSheetAt(0);
					fillRemarkData(sheet,sjType,unitId);
					List<ConReportBean> listBean=buildConReportExportData(reportId);
					Cell flagCell=ExcelToXML.findFirstStrInSheet(sheet, "DataFlag");
					if(flagCell!=null){
						int flagRowIndex=flagCell.getRowIndex();
						int flagCellIndex=flagCell.getColumnIndex();
						int rownum=flagRowIndex+1;
						int xh=1;
						//写入数据
		        		for(ConReportBean dataBean : listBean) {
		        			Row hssfRow = sheet.getRow(rownum);
		        			if(hssfRow==null) {
		        				hssfRow = sheet.createRow(rownum) ;
		        			}
		        			fillCellData(xh+"",hssfRow,flagCellIndex+1,"varchar2",wb);
		        			fillCellData(dataBean.getContypename(),hssfRow,flagCellIndex+2,"varchar2",wb);
		        			fillCellData(dataBean.getConno(),hssfRow,flagCellIndex+3,"varchar2",wb);
		        			fillCellData(dataBean.getPartybno(),hssfRow,flagCellIndex+4,"varchar2",wb);
		        			fillCellData(dataBean.getBatch(),hssfRow,flagCellIndex+5,"varchar2",wb);
		        			fillCellData(dataBean.getConvaluemoney(),hssfRow,flagCellIndex+6,"number",wb);
		        			fillCellData(dataBean.getConpay(),hssfRow,flagCellIndex+7,"number",wb);
		        			fillCellData(dataBean.getPredictPayment1(),hssfRow,flagCellIndex+8,"number",wb);
		        			fillCellData(dataBean.getPredictPayment2(),hssfRow,flagCellIndex+9,"number",wb);
		        			fillCellData(dataBean.getPredictPayment3(),hssfRow,flagCellIndex+10,"number",wb);
		        			fillCellData(dataBean.getRemark(),hssfRow,flagCellIndex+11,"varchar2",wb);
		        			rownum ++ ;
		        			xh++;
		        		}
						bos = new ByteArrayOutputStream() ;
						wb.write(bos) ;
						bos.flush() ;
						bos.close() ;
						return bos ;
					}
				}else{
					throw new ExcelPortException("模板文件读取异常！");
				}
			} catch (IOException e) {
				throw e ;
			}
		}
		return bos;
	}
	public void fillCellData(Object value,Row row,int cellIndex,String cellType,Workbook wb){
		Cell hssfCell = row.getCell(cellIndex);
		if(hssfCell==null) {
			hssfCell = row.createCell(cellIndex) ;
		}
		Short dataFormat = setCellValue(hssfCell,cellType,value);
		Map<String,String> ctstyleMap = new HashMap<String, String>();
		if(dataFormat!=null) {
			ctstyleMap.put("dataFormat", dataFormat+"") ;
		}
		HashMap<String,CellStyle> stylesMap = new HashMap<String,CellStyle>();
		//设置单元格样式
		hssfCell.setCellStyle(XMLToExcel.getConfigStyle(wb,stylesMap,ctstyleMap)) ;
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
			}else if(cellValue instanceof Double) {
				hfcell.setCellValue((Double)cellValue) ;
			}
		} else {
			RichTextString value = new HSSFRichTextString(StringUtil.objectToString(cellValue)) ;
			hfcell.setCellValue(value) ;
		}
		return dataFormat;
	}
	/**
	 * 替换文件中的非数据形式的信息
	 * @param sheet
	 * @author: Ivy
	 * @createDate: 2011-1-7
	 */
	private void fillRemarkData (Sheet sheet,String sjType,String unitId) {
		String[] sjRemarks = {"YYYY", "YYYYQ", "YYYYMM", "YYYYMMDD","MM"};
		//时间的替换 年份、季度、月份、日期；
		for (int i = 0; i < sjRemarks.length; i++) {
			String remark = sjRemarks[i];
			if (sjType!=null && sjType.length()>0) {
				String replacement = "";
				if (sjType.length()==4) {
					replacement = sjType.substring(0, 4)+"年";
				} else if (sjType.length()==5) {
					replacement = sjType.substring(0, 4)+"年" + sjType.substring(4, 5)+"季度";
				} else if (sjType.length()==6) {
					replacement = sjType.substring(0, 4)+"年" + sjType.substring(4, 6)+"月";
				} else if (sjType.length()==8) {
					replacement = sjType.substring(0, 4)+"年" + sjType.substring(4, 6)+"月" + sjType.substring(6, 8)+"日";
				}
				List<Cell> list1 = ExcelToXML.findStrInSheet(sheet, "{" + remark + "}");
				for (int j = 0; j < list1.size(); j++) {
					Cell cell = list1.get(j);
					cell.setCellValue(cell.getStringCellValue().replaceAll("\\{" + remark + "\\}", replacement));
				}
			}
		}
	}
	/**
	 * 月度资金计划管理初始化
	 * author shuz
	 */
	public String initFunMonthPlan(FundMonthPlanD fundMonthPlanD){
		fundMonthPlanDAO.insert(fundMonthPlanD);
		return "1";
	}
	/**
     * DOUBLE精确的加法运算。
     * @param v1 被加数
     * @param v2 加数
     * @return 两个参数的和
     */
	public double add(double v1,double v2){
		BigDecimal b1 = new BigDecimal(Double.toString(v1));
		BigDecimal b2 = new BigDecimal(Double.toString(v2));
		return b1.add(b2).doubleValue();
	}

}
