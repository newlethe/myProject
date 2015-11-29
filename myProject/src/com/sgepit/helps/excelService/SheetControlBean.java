/** 
 * Title:        excel应用: 
 * Description:  excel应用
 * Company:      sgepit
 */
package com.sgepit.helps.excelService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.RichTextString;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;

import com.sgepit.helps.dataService.model.EventBean;
import com.sgepit.helps.dataService.model.HeaderBean;
import com.sgepit.helps.dbService.sqlHelp.BuildSql;
import com.sgepit.helps.webdynproService.export.ExcelPortException;
/**
 * sheet页控制对象
 * @author lizp
 * @Date 2010-8-19
 */
public class SheetControlBean {
	 /**
     * excel中以controlStr标识为控制字段
     * 控制字段后面接前置和后置sql，通过-分隔前后置事件，事件中通过;分隔多个事件
     * 如：syscell:delete * from dual ; delete * from dual - update dual set 1=1
     *    上例有两个前置sql事件和一个后置sql事件
     */
    private final static String controlStr = "syscell:" ; //控制信息标识
    private final static int controlStrLenth = 8 ;  //控制信息开始位置
    private final static String colSplitStr = "/"; //列控制对象分隔符
    private final static String eventSplitStr = ";"; //事件分隔符
    private final static String typeSplitStr = "-"; //控制字段大类分隔符
    private final static String variableFlag = "$";  //变量起点标志
    
	private int rowIndex ;
	private int colIndex ;
	private List<EventBean> beforeEvents = new ArrayList<EventBean>() ; //前置事件集合
	private List<EventBean> afterEvents = new ArrayList<EventBean>() ;  //后置事件集合
	private String filter ; //过滤条件集合
	private Set<String> tableNames = new HashSet<String>() ; //表名
	private List<ColumnControlBean> columnBeans = new ArrayList<ColumnControlBean>();  //控制列对象
	private Map<String,Object> propertys = new HashMap<String,Object>();
	
	public Set<String> getTableNames() {
		return tableNames;
	}
	public void setTableNames(Set<String> tableNames) {
		this.tableNames = tableNames;
	}
	public void addTableNames(String tableName) {
		this.tableNames.add(tableName);
	}
	public List<ColumnControlBean> getColumnBeans() {
		return columnBeans;
	}
	public void setColumnBeans(List<ColumnControlBean> columnBeans) {
		this.columnBeans = columnBeans;
	}
	public void addColumnBeans(ColumnControlBean bean) {
		this.columnBeans.add(bean);
	}
	public List<EventBean> getBeforeEvents() {
		return beforeEvents;
	}
	public void setBeforeEvents(List<EventBean> beforeEvents) {
		this.beforeEvents = beforeEvents;
	}
	public List<EventBean> getAfterEvents() {
		return afterEvents;
	}
	public void setAfterEvents(List<EventBean> afterEvents) {
		this.afterEvents = afterEvents;
	}
	public String getFilter() {
		return filter;
	}
	public void setFilter(String filter) {
		this.filter = filter;
	}
	public int getRowIndex() {
		return rowIndex;
	}
	public void setRowIndex(int rowIndex) {
		this.rowIndex = rowIndex;
	}
	public int getColIndex() {
		return colIndex;
	}
	public void setColIndex(int colIndex) {
		this.colIndex = colIndex;
	}
	public Map<String, Object> getPropertys() {
		return propertys;
	}
	public void setPropertys(Map<String, Object> propertys) {
		this.propertys = propertys;
	}
	/**
	 * 构造sheet页控制对象
	 * @param str
	 * @param map
	 */
	public void bulidSheetControlBean(String str,Map<String, String> map) {
		 bulidSheetControlBean(tranControlInfomation(str,map));
	}
	
	/**
	 * 构造sheet页控制对象
	 * @param str
	 */
	public void bulidSheetControlBean(String str) {
	    String value = str.substring(controlStrLenth) ;
	    if (value != null) {
			String[] events = value.split("["+typeSplitStr+"]");
	
			// 前置事件
			String beforeEvents = events[0];
			List<EventBean> before = getEvents(beforeEvents);
			setBeforeEvents(before) ;
			
			// 后置事件
			if (events.length > 1) {
			    String afterEvents = events[1];
			    List<EventBean> after = getEvents(afterEvents);
			    setAfterEvents(after);
			}
			//过滤条件
			if (events.length > 2) {
//				String filter = events[2];
				StringBuffer filter = new StringBuffer();
				for (int i=2; i<events.length; i++){
					filter.append(events[i]).append('-');
				}
				setFilter(filter.toString().substring(0, filter.length()-1));
			}
		}
	}
	
	/**
	 * 获取事件
	 * @param events 事件字符串
	 * @return
	 */
    private static List<EventBean> getEvents(String events) {
    	List<EventBean> list = new ArrayList<EventBean>();
		if (events != null) {
		    String[] beforeEvent = events.split("["+eventSplitStr+"]");
		    for (String e : beforeEvent) {
				if (e != null) {
				    EventBean b = new EventBean();
				    b.setSqlEventValues(e);
				    list.add(b);
				}
		    }
		}
		return list ;
    }
    
    /**
     * 转换控制信息
     * @param str 控制信息字符串
     * @param map 参数集合
     * @return
     */
    public static String tranControlInfomation(String str,Map<String, String> map) {
    	if (map!=null&&!map.isEmpty()) {
			Iterator<String> it = map.keySet().iterator();
			while (it.hasNext()) {
			    String key = it.next();
			    String value = map.get(key);
			    str = str.replace(variableFlag + key,value);
			}
		}
		return str;
	}
    
    /**
     * 由sheet页对象获得sheet页控制信息对象
     * @param sheet
     * @param map
     * @return
     */
	public static SheetControlBean getSheetControlBean(Sheet sheet,Map<String, String> map) {
		SheetControlBean bean = null ;
		Cell cell = ExcelToXML.findFirstStrInSheet(sheet, controlStr);
		if (cell != null) { // 查找到配置信息位置
		    int rowIndex = cell.getRowIndex();
		    int columnIndex = cell.getColumnIndex();
		    String controlStrValue = cell.getStringCellValue(); // 控制字段中的信息
		    bean = new SheetControlBean();
		    bean.bulidSheetControlBean(controlStrValue,map);
		    bean.setColIndex(columnIndex) ;
		    bean.setRowIndex(rowIndex) ;
		    //处理列控制信息
		    Row beforeRow = null ;
		    try {
				beforeRow = sheet.getRow(rowIndex-1) ;
			} catch (Exception e1) {
			}
		    
		    Row controlRow = sheet.getRow(rowIndex);
		    int lastCellNum = controlRow.getLastCellNum();
		    
		    for (int i = columnIndex + 1; i < lastCellNum; i++) {
				Cell col = controlRow.getCell(i);
				if (col != null) {
				    if (col.getCellType() == Cell.CELL_TYPE_STRING) { // 如果为字符串时
						String controlValue = col.getStringCellValue();
						if (controlValue != null) {// 控制字段格式为：表名/字段名/数据库类型/主键类型
							ColumnControlBean colBean = new ColumnControlBean();
						    String[] cols = controlValue.split("["+colSplitStr+"]");
						    String tableName = cols[0] ;
						    if(tableName!=null&&(!"".equals(tableName))) {
						    	tableName = tableName.toLowerCase() ;
						    	colBean.setTableName(tableName) ;
						    	bean.addTableNames(tableName) ;
						    	if (cols.length > 2) {
							    	colBean.setColIndex(i) ;
							    	colBean.setRowIndex(rowIndex) ;
							    	colBean.setColName(cols[1]) ;
							    	colBean.setDbType(cols[2]) ;
									if (cols.length > 3) {
									    try {
											int keyType = Integer.parseInt(cols[3]);
											colBean.setKeyType(keyType);
									    } catch (NumberFormatException e) {
									    }
									}
									//获得上一行内容来当作表格头
							    	if(beforeRow!=null) {
							    		Cell labelCell = beforeRow.getCell(i);
							    		if(labelCell!=null) {
							    			RichTextString rcell = labelCell.getRichStringCellValue();
							    			if(rcell!=null) {
							    				colBean.setColLabel(rcell.getString()) ;
							    			}
							    		}
							    	}
									bean.addColumnBeans(colBean) ;
							    }
						    }
						}
				    }
				}
		    }
		}
		return bean;
	}
	
	/**
	 * 获得头对象
	 * @return
	 */
	public List<HeaderBean> getByHeadBean() {
		 List<HeaderBean> header = new ArrayList<HeaderBean>();
		 List<ColumnControlBean> list = this.columnBeans;
		 int i = 1 ;
		 for(ColumnControlBean bean : list ) {
			 HeaderBean head = bean.getByHeadBean();
			 head.setIndex(i++) ;
			 header.add(head) ;
		 }
		return header;
	}
	
	/**
	 * 获得第一个表表名
	 * @return
	 * @throws ExcelPortException 
	 */
	public String getFirstTableName() throws ExcelPortException {
		Iterator<String> it = this.tableNames.iterator();
		if(it.hasNext()) {
			return it.next() ;
		} else {
			throw new ExcelPortException("表名为空，请检查模板配置");
		}
	}
	
	/**
	 * 生成sql对象
	 * @return
	 */
	public BuildSql buildSql() {
		BuildSql sqlHelper = new BuildSql();
		List<String> colList = new ArrayList<String>();
		List<ColumnControlBean> list = this.columnBeans ;
		for(ColumnControlBean bean : list ) {
			colList.add(bean.getColName()) ;
		 }
		List<String> filter = new ArrayList<String>() ;
		if(this.filter!=null) {
			filter.add(this.filter) ;
		}
		sqlHelper.BuildUnitSql(colList, this.tableNames, filter) ;
		return sqlHelper;
	}
}
