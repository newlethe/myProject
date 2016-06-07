/** 
 * Title:        excel应用: 
 * Description:  excel导出应用
 * Company:      sgepit
 */
package com.sgepit.helps.excelService;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.helps.dbService.DbCon;
import com.sgepit.helps.dbService.exception.DbPropertyException;
import com.sgepit.helps.dbService.sqlHelp.BuildSql;
import com.sgepit.helps.util.StringUtil;
import com.sgepit.helps.webdynproService.export.ExcelPortException;

/**
 * 通过模板导出excel
 * @author lizp
 * @Date 2010-8-19
 */
public class ExcelExportByTemplate {
	private final static String HSSFTypeFlag = "xls" ;
    private final static String XSSFTypeFlag = "xlsx" ;
	private final static String controlStr = "syscell:";
	private final static String[] sjRemarks = {"YYYY", "YYYYQ", "YYYYMM", "YYYYMMDD"};
	private Workbook wb ; //excel模板对象
	private Map<String,String> map ;//参数集合
	private HashMap<String,CellStyle> stylesMap = new HashMap<String,CellStyle>() ;//样式map，存放各种样式
	
	public Workbook getWb() {
		return wb;
	}

	public ExcelExportByTemplate(Workbook wb, Map<String, String> map) {
		this.wb = wb;
		this.map = map;
	}

	public ExcelExportByTemplate(Workbook wb) {
		this.wb = wb;
	}
	
	public ExcelExportByTemplate(InputStream in, Map<String, String> map) throws IOException {
		this.map = map ;
		try {
			this.wb = new HSSFWorkbook(in) ;
		} catch (IOException e) {
			throw e ;
		}
	}
	
	public ExcelExportByTemplate(InputStream in, Map<String, String> map,String type) throws IOException, ExcelPortException {
		this.map = map;
    	if(HSSFTypeFlag.equalsIgnoreCase(type)) {
    		wb = new HSSFWorkbook(in) ;
    	}else if(XSSFTypeFlag.equalsIgnoreCase(type)){
    		wb = new XSSFWorkbook(in);
    	}else {
    		throw new ExcelPortException("类型"+type+"不允许导入！");
    	}
	}
	
	/**
	 * 根据模板配置，生成excel
	 * @return
	 * @throws IOException
	 * @throws SQLException 
	 * @throws DbPropertyException 
	 * @throws ExcelPortException 
	 */
	public ByteArrayOutputStream fillDataToExcel() throws IOException, DbPropertyException, SQLException, ExcelPortException{
		if(wb!=null) {
			int sheetNumber = wb.getNumberOfSheets(); // 获得总sheet数
			for (int i = 0; i < sheetNumber; i++) {
			    Sheet sheet = wb.getSheetAt(i);
			    fillSheetData(sheet) ;
			}
			
			ByteArrayOutputStream bos = new ByteArrayOutputStream() ;
			wb.write(bos) ;
			bos.flush() ;
			bos.close() ;
			return bos ;
		}else{
			throw new ExcelPortException("模板文件读取异常！");
		}
	}
	
	/**
	 * 生成sheet页数据
	 * @param sheet
	 * @throws SQLException 
	 * @throws DbPropertyException 
	 */
	private void fillSheetData(Sheet sheet) throws DbPropertyException, SQLException {
		fillRemarkData(sheet);
		SheetControlBean sheetControlBean = SheetControlBean.getSheetControlBean(sheet,map);
    	if(sheetControlBean!=null) {
    		//获取数据
    		List<Map<String,Object>> list = getDataBySheetControlBean(sheetControlBean);
    		if(list!=null) {
    			int rownum = sheetControlBean.getRowIndex()+1 ;
    			List<ColumnControlBean> beans = sheetControlBean.getColumnBeans();
    			//写入数据
        		for(Map<String,Object> map : list) {
        			Row hssfRow = sheet.getRow(rownum);
        			if(hssfRow==null) {
        				hssfRow = sheet.createRow(rownum) ;
        			}
        			for(ColumnControlBean bean : beans) {
        				String colName = bean.getColName().replaceAll(" ", "") ;
        				//模板可以查询多个表或视图，但存在同名列，需要用表名.列名，故此处只取.后的部分 pengy 2014-06-12
        				if (colName.indexOf(".")>0){
        					colName = colName.substring(colName.indexOf(".") + 1);
        				}
        				Object value = map.get(colName) ;
        				int colIndex = bean.getColIndex() ;
        				Cell hssfCell = hssfRow.getCell(colIndex);
        				if(hssfCell==null) {
        					hssfCell = hssfRow.createCell(colIndex) ;
        				}
        				Short dataFormat = setCellValue(hssfCell,bean.getDbType(),value);
        				Map<String,String> ctstyleMap = new HashMap<String, String>();
        				if(dataFormat!=null) {
        					ctstyleMap.put("dataFormat", dataFormat+"") ;
        				}
        				//设置单元格样式
        				hssfCell.setCellStyle(XMLToExcel.getConfigStyle(wb,stylesMap,ctstyleMap)) ;
        			}
        			rownum ++ ;
        		}
    		}
    	}
	}
	
	/**
	 * 由bean对象获得数据
	 * @param bean
	 * @return
	 * @throws DbPropertyException 
	 * @throws SQLException 
	 */
	private List<Map<String, Object>> getDataBySheetControlBean(SheetControlBean bean) throws DbPropertyException, SQLException {
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
			}else if(cellValue instanceof String){
				//对于配置excel配置列时，列名有特殊处理的， 从map中取出的value无法自动转为BigDecimal，当做String来处理
				RichTextString value = new HSSFRichTextString(StringUtil.objectToString(cellValue)) ;
				hfcell.setCellValue(value) ;
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
	private void fillRemarkData (Sheet sheet) {
		//合同名称的替换
		String remark1 = "{CONNAME}";
		if (map.containsKey("contractId") && map.get("contractId")!=null) {
			String getConInfoSql = "select conname from con_ove where conid='" + map.get("contractId") + "'";
			List<Map<String, String>> conList = JdbcUtil.query(getConInfoSql);
			if (conList.size()==1) {
				String conName = conList.get(0).get("conname");
				
				List<Cell> list1 = ExcelToXML.findStrInSheet(sheet, remark1);
				for (int i = 0; i < list1.size(); i++) {
					Cell cell = list1.get(i);
					cell.setCellValue(cell.getStringCellValue().replaceAll("\\{CONNAME\\}", conName));
				}
			}
		}
		
		//时间的替换 年份、季度、月份、日期；
		for (int i = 0; i < sjRemarks.length; i++) {
			String remark = sjRemarks[i];
			if (map.containsKey("sjType") && map.get("sjType")!=null) {
				String sjType = map.get("sjType");
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
	}
}
