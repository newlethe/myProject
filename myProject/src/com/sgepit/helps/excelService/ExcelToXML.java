/** 
 * Title:        excel应用: 
 * Description:  excel导入应用
 * Company:      sgepit
 */
package com.sgepit.helps.excelService;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.sgepit.helps.dataService.DataXmlHelp;
import com.sgepit.helps.dataService.exception.DataHelpException;
import com.sgepit.helps.dataService.exception.DataTypeException;
import com.sgepit.helps.dataService.model.DataBean;
import com.sgepit.helps.dataService.model.DataColBean;
import com.sgepit.helps.dataService.model.DataModel;
import com.sgepit.helps.dataService.model.DataRowBean;
import com.sgepit.helps.dataService.model.HeaderBean;
import com.sgepit.helps.util.StringUtil;
import com.sgepit.helps.webdynproService.export.ExcelPortException;


/**
 * 处理excel文件流对象与数据单体模型xml转换
 * 主要应用在excel导入的实现中
 * @author lizp
 * @Date 2010-8-10
 */
public class ExcelToXML {
    /**
     * 待导入excel中以controlStr标识为控制字段
     * 控制字段后面接前置和后置sql，通过-分隔前后置事件，事件中通过;分隔多个事件
     * 如：syscell:delete * from dual ; delete * from dual - update dual set 1=1
     *    上例有两个前置sql事件和一个后置sql事件
     * 出现在第2个 -  后面就是  数据库导出到 excel的条件。   
     */
    private final static String controlStr = "syscell:";
    private final static String HSSFTypeFlag = "xls" ;
    private final static String XSSFTypeFlag = "xlsx" ;
    
    /**
     * 由excel文件流对象生成数据单体模型xml
     * 默认文件类型为xls
     * @param in excel文件流
     * @return 数据体模型的xml
     * @throws IOException 
     * @throws DataTypeException 
     * @throws DataHelpException 
     * @throws ExcelPortException 
     */
    public static String inputStreamToDocument(InputStream in) throws IOException, DataHelpException, DataTypeException, ExcelPortException  {
		return inputStreamToDocument(in,HSSFTypeFlag);
    }
    /**
     * 由excel文件流对象生成数据单体模型xml
     * @param in excel文件流
     * @param type 文件类型标识
     * @return 数据体模型的xml
     * @throws IOException 
     * @throws DataTypeException 
     * @throws DataHelpException 
     * @throws ExcelPortException 
     */
    public static String inputStreamToDocument(InputStream in,String type) throws IOException, DataHelpException, DataTypeException, ExcelPortException  {
    	return inputStreamToDocument(in,null,type);
    }
    /**
     * 由excel文件流对象生成数据单体模型xml
     * @param in excel文件流
     * @param map 变量集合
     * @return 数据体模型的xml
     * @throws IOException 
     * @throws DataTypeException 
     * @throws DataHelpException 
     * @throws ExcelPortException 
     */
    public static String inputStreamToDocument(InputStream in,Map<String, String> map) throws IOException, DataHelpException, DataTypeException, ExcelPortException  {
    	return inputStreamToDocument(in,map,HSSFTypeFlag);
    }

    /**
     * 由excel文件流对象生成数据单体模型xml(带变量)
     * 在待导入的excel控制字段的事件中可能存在变量，在导入过程中变量由map中对应的变量值替换
     * 如：syscell:delete * from dual where year = $year
     *    则在导入过程中$year将被替换为map对象中对应的具体值 
     * @param in excel文件流
     * @param map 变量集合
     * @return 数据体模型的xml
     * @throws IOException 
     * @throws DataTypeException 
     * @throws DataHelpException 
     * @throws ExcelPortException 
     */
    public static String inputStreamToDocument(InputStream in,Map<String, String> map,String type) throws IOException, DataHelpException, DataTypeException, ExcelPortException  {
    	Workbook wb = null ;
    	if(HSSFTypeFlag.equalsIgnoreCase(type)) {
    		wb = new HSSFWorkbook(in) ;
    	}else if(XSSFTypeFlag.equalsIgnoreCase(type)){
    		wb = new XSSFWorkbook(in);
    	}else {
    		throw new ExcelPortException("类型"+type+"不允许导入！");
    	}
    	List<DataBean> bean = hssfWorkBookToDataBeans(wb,new HashMap<String, String>());
		return DataXmlHelp.bulidDataXml(bean);
    }

    
    /**
     * excel导入实现(HSSFWorkbook对象到数据集List<DataBean>对象的转换)
     * @param wb poi的excel对象
     * @param map 变量集合
     * @return 数据体模型
     * @throws ExcelPortException 
     */
    private static List<DataBean> hssfWorkBookToDataBeans(Workbook wb,Map<String, String> map) throws ExcelPortException {
		List<DataBean> beans = new ArrayList<DataBean>();
		int sheetNumber = wb.getNumberOfSheets(); // 获得总sheet数
		for (int i = 0; i < sheetNumber; i++) {
		    DataBean bean = new DataBean();
		    Sheet sheet = wb.getSheetAt(i);
		    hssfSheetToTableElement(sheet, bean, map);
		    if (bean.getDatas() != null) {
		    	beans.add(bean);
		    }
		}
		return beans;
    }

    /**
     * sheet页对象生成数据单体对象
     * @param sheet poi的sheet对象
     * @param bean 数据体对象
     * @param map 变量集合
     * @throws ExcelPortException 
     */
    private static void hssfSheetToTableElement(Sheet sheet, DataBean bean,Map<String, String> map) throws ExcelPortException {
    	SheetControlBean sheetControlBean = SheetControlBean.getSheetControlBean(sheet,map);
    	if(sheetControlBean!=null) {
    		DataModel model = new DataModel();
    		List<HeaderBean> header = sheetControlBean.getByHeadBean();
    		model.setHeader(header);
		    model.setTableName(sheetControlBean.getFirstTableName()) ;
		    int lastRow = sheet.getLastRowNum();
		    
		    Set<String> keys = new HashSet<String>();
		    
		    // 处理数据部分
		    List<DataRowBean> datas = new ArrayList<DataRowBean>();
		    for (int r = sheetControlBean.getRowIndex() + 1; r < lastRow + 1; r++) {
				Row hssfrow = sheet.getRow(r);
				if (hssfrow != null) {
				    DataRowBean rowBean = new DataRowBean();
				    rowBean.setRownum(r);
				    List<DataColBean> cols = new ArrayList<DataColBean>();
				    int i = 0;
				    boolean flag = true;
				    List<ColumnControlBean> columnBeans = sheetControlBean.getColumnBeans();
				    for (ColumnControlBean cbean : columnBeans)  {
				    	Integer c = cbean.getColIndex() ;
						HeaderBean headerBean = header.get(i);
						String type = headerBean.getType();
						int keyType = headerBean.getColType();
						Cell hssfcell = hssfrow.getCell(c);
						Object value = null;
						if (hssfcell != null) {
						    value = getCellValueByType(hssfcell, type);
						}
						if (keyType == ColumnControlBean.COL_TYPE_NOTNULL) {// 必输字段
						    if (value == null) {
							flag = false;
							break;
						    }
						} else if (keyType == ColumnControlBean.COL_TYPE_AUTOUUID) {// 自动主键
						    value = StringUtil.getUUID();
						}else if(keyType == ColumnControlBean.COL_TYPE_KEY){  //为主键时
							if (value == null) {
								flag = false;
								break;
							  }else {  //不为空时
								  keys.add(cbean.getColName()) ;
							  }
						}
						if (value != null) {
						    DataColBean colBean = new DataColBean();
						    colBean.setIndex(i+1);
						    colBean.setValue(value);
						    cols.add(colBean);
						}
						i++;
				    }
				    if (flag) {
					rowBean.setCols(cols);
					datas.add(rowBean);
				    }
				}
		    }
		    if(keys.size()>0) {
		    	String key = "" ;
		    	for(String s : keys) {
		    		key += ","+s ;
		    	}
		    	key = key.substring(1) ;
		    	model.addPropertys("keys", key) ;
		    	model.addPropertys("type", "saveOrUpdate") ;
		    }
		    model.setDatas(datas);
		    bean.setDatas(model);
    	}
    }

    /**
     * 通过类型cell对象的值
     * 目前仅处理了几类常用类型的值，包括：DATE型，NUMBER型，VARCHAR2型，LONG型及CHAR型
     * @param hssfcell poi的cell对象
     * @param type 类型标识字符串
     * @return 单元格中的值
     */
    public static Object getCellValueByType(Cell hssfcell, String type) {
		Object value = null;
		int cellType = hssfcell.getCellType();
		if ("DATE".equalsIgnoreCase(type)) {
		    try {
			Date date = hssfcell.getDateCellValue();
			value = new java.sql.Date(date.getTime());
		    } catch (Exception e) {
	
		    }
		} else if ("BINARY_DOUBLE".equalsIgnoreCase(type)) {
	
		} else if ("BINARY_FLOAT".equalsIgnoreCase(type)) {
		} else if ("CHAR".equalsIgnoreCase(type)) {
		    value = getStringValue(hssfcell);
		} else if ("INTERVALDS".equalsIgnoreCase(type)) {
		} else if ("INTERVALYM".equalsIgnoreCase(type)) {
		} else if ("NUMBER".equalsIgnoreCase(type)) {
		    if (cellType == hssfcell.CELL_TYPE_NUMERIC
			    || cellType == hssfcell.CELL_TYPE_FORMULA) {
			value = new BigDecimal(hssfcell.getNumericCellValue());
		    }
		} else if ("VARCHAR2".equalsIgnoreCase(type)) {
		    value = getStringValue(hssfcell);
		} else if ("RAW".equalsIgnoreCase(type)) {
		} else if ("TIMESTAMP".equalsIgnoreCase(type)) {
		} else if ("TIMESTAMPLTZ".equalsIgnoreCase(type)) {
		} else if ("TIMESTAMPTZ".equalsIgnoreCase(type)) {
		} else if ("LONG".equalsIgnoreCase(type)) {
		    value = getStringValue(hssfcell);
		} else if ("LONG RAW".equalsIgnoreCase(type)) {
		} else if ("BLOB".equalsIgnoreCase(type)) {
		} else if ("CLOB".equalsIgnoreCase(type)) {
		} else if ("ROWID".equalsIgnoreCase(type)) {
		}
		return value;
    }

    /**
     * 获得cell对象的字符串值
     * @param hssfcell poi的cell对象
     * @return cell对象中的字符串值或者能转换成字符串值的值
     */
    public static String getStringValue(Cell hssfcell) {
		String value = null;
		int cellType = hssfcell.getCellType();
		if (cellType == Cell.CELL_TYPE_STRING) {
		    value = hssfcell.getStringCellValue();
		} else if (cellType == Cell.CELL_TYPE_NUMERIC) {
		    value = hssfcell.getNumericCellValue() + "";
		} else if (cellType == Cell.CELL_TYPE_FORMULA) {
		    value = hssfcell.getNumericCellValue() + "";
		} else if (cellType == Cell.CELL_TYPE_BOOLEAN) {
		    value = hssfcell.getBooleanCellValue() + "";
		}
		return value;
    }

    /**
     * 在sheet页中查找字符串(在字符串型中查找)
     * @param sheet poi的sheet对象
     * @param str 待查找的字符串
     * @return poi的Cell对象
     */
    public static Cell findFirstStrInSheet(Sheet sheet, String str) {
		int firstNum = sheet.getFirstRowNum();
		int lastNum = sheet.getLastRowNum();
		if (lastNum >= firstNum) {
		    for (int r = firstNum; r < lastNum + 1; r++) {
				Row row = sheet.getRow(r);
				if (row != null) {
				    Iterator<Cell> cellIt = row.cellIterator();
				    while (cellIt.hasNext()) {
						Cell cell = cellIt.next();
						if (cell != null) {
						    int type = cell.getCellType();
						    if (type == Cell.CELL_TYPE_STRING) {
								String value = cell.getStringCellValue();
								if (value != null && value.indexOf(str) > -1) {
								    return cell;
								}
						    }
						}
				    }
				}
		    }
		}
		return null;
    }
    
    /**
     * 在sheet页中查找字符串(在字符串型中查找)
     * @param sheet poi的sheet对象
     * @param str 待查找的字符串
     * @return poi的Cell对象
     */
    public static List<Cell> findStrInSheet(Sheet sheet, String str) {
    	List<Cell> list = new ArrayList<Cell>();
		int firstNum = sheet.getFirstRowNum();
		int lastNum = sheet.getLastRowNum();
		if (lastNum >= firstNum) {
		    for (int r = firstNum; r < lastNum + 1; r++) {
				Row row = sheet.getRow(r);
				if (row != null) {
				    Iterator<Cell> cellIt = row.cellIterator();
				    while (cellIt.hasNext()) {
						Cell cell = cellIt.next();
						if (cell != null) {
						    int type = cell.getCellType();
						    if (type == Cell.CELL_TYPE_STRING) {
								String value = cell.getStringCellValue();
								if (value != null && value.indexOf(str) > -1) {
								    list.add(cell);
								}
						    }
						}
				    }
				}
		    }
		}
		return list;
    }
}
