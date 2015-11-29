package com.sgepit.frame.util.xgridload;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.TimeZone;

import javax.servlet.ServletContext;

import net.sf.ezmorph.object.DateMorpher;
import net.sf.json.util.JSONUtils;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFComment;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.Region;
import org.dom4j.Attribute;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.base.service.BaseMgmFacade;
import com.sgepit.frame.sysman.hbm.AppFileinfo;
import com.sgepit.frame.sysman.service.ApplicationMgmFacade;
import com.sgepit.frame.sysman.service.ApplicationMgmImpl;
import com.sgepit.frame.util.DateUtil;
import com.sgepit.frame.util.UUIDGenerator;

public class XMLToExcel {
	private BaseDAO baseDao;
	private ApplicationMgmFacade applicationmgm;
	
	public XMLToExcel() {
		this.applicationmgm = (ApplicationMgmFacade) Constant.wact.getBean("applicationMgm");
		this.baseDao = (BaseDAO) Constant.wact.getBean("baseDAO");
	}
	
	/**
	 * 由特定xml格式生成excel
	 * 此方法目前对样式处理仅限于常用样式
	 * @param xml
	 * xml格式如下
	 * <workbooks>
	 * 		<workbook name="1" template="file_lsh">
	 * 				<sheet name="1" colWidths="100,100,-1,0" colTypes="string,number,date,time" hide="0" colAlign="left,center,right" template="1">
	 * 					<row index="0">
	 * 						<cell index="1" type="string" fontSize='5'>
	 * 						</cell>
	 * 					</row>
	 * 				</sheet>
	 * 		</workbook>
	 * </workbooks>
	 * @return String  文件流水号(多个文件是用`号分隔)
	 */
	public String XMLStringToExcel(String xml) {
		String file_lsh = "" ;
		try {
			Document document = DocumentHelper.parseText(xml) ;
			List<Element> wblist = document.selectNodes("/workbooks/workbook") ;
			for(int w = 0;w < wblist.size() ; w++)  {
				Element wb = wblist.get(w) ;
				String wbname = wb.attributeValue("name")==null?UUIDGenerator.getNewID()+".xls":wb.attributeValue("name");
				String wbtemplate = wb.attributeValue("template") ;
				//创建excel对象
				HSSFWorkbook hfwb = null ;
				if(wbtemplate==null)  {
					hfwb = new HSSFWorkbook() ;
				} else {
					try {
						hfwb = new HSSFWorkbook(getExcelStream(wbtemplate)) ;
					} catch (IOException e) {
						e.printStackTrace();
					} 
				}
				if(hfwb!=null) {
					HashMap<String,HSSFCellStyle> stylesMap = new HashMap<String,HSSFCellStyle>() ;//样式map，存放各种样式
					getConfigStyle(hfwb,stylesMap,new HashMap()) ;
					List<Element> sheetslist = wb.elements("sheet") ;
					ArrayList<String> templateSheetNames = new ArrayList() ;
					for(int i=0;i<hfwb.getNumberOfSheets();i++) {
						templateSheetNames.add(hfwb.getSheetName(i)) ;
					}
					for(int s = 0 ;s < sheetslist.size() ;s++)  {
						Element sheet = sheetslist.get(s) ;
						String sheetTemplate = sheet.attributeValue("template") ;
						String sheetname = sheet.attributeValue("name") ;
						String colWidths = sheet.attributeValue("colWidths") ;
						String colTypes = sheet.attributeValue("colTypes") ;
						String colAlign = sheet.attributeValue("colAlign") ;
						ArrayList widthList = new ArrayList() ;
						ArrayList typeList = new ArrayList() ;
						ArrayList alignList = new ArrayList() ;
						if(colWidths!=null) {   //列宽数组
							for(int i=0;i<colWidths.split("[,]").length;i++)  {
								widthList.add(colWidths.split("[,]")[i]) ;
							}
						}
						if(colTypes!=null) {  //列类型数组
							for(int i=0;i<colTypes.split("[,]").length;i++)  {
								typeList.add(colTypes.split("[,]")[i]) ;
							}
						}
						if(colAlign!=null) {  //水平对齐方式
							for(int i=0;i<colAlign.split("[,]").length;i++)  {
								alignList.add(tranAlign(colAlign.split("[,]")[i].toLowerCase())+"") ;
							}
						}
						
						//创建sheet页
						HSSFSheet hfsheet = null ;
						if(sheetTemplate==null||(!isNum(sheetTemplate))||(Integer.parseInt(sheetTemplate)+1>hfwb.getNumberOfSheets()))  {
							hfsheet = hfwb.createSheet() ;
						} else {   //存在模板时(对应着复制的sheet页序号)
							hfsheet = hfwb.cloneSheet(Integer.parseInt(sheetTemplate)) ;
						}
						List<Element> rowlist = sheet.elements("row") ;
						for(int r = 0 ;r < rowlist.size() ;r++)  {
							Element row = rowlist.get(r)  ;
							String rowindex = row.attributeValue("index") ;
							HashMap rmap = new HashMap() ;
							Iterator it = row.attributeIterator() ;
							while(it.hasNext()) {
								Attribute attribute = (Attribute) it.next() ;
								String attributeName = attribute.getName() ;
								if(attributeName.equals("index")) {
									continue ;
								} else {
									if(rmap.containsKey(attributeName)) {
										rmap.remove(attributeName) ;
									}
									rmap.put(attributeName,attribute.getText()) ;
								}
							}
							//相关属性
							int rindex = 0 ;
							if(rowindex!=null) {
								rindex = Integer.parseInt(rowindex) ;
							}  else {
								if(hfsheet.getPhysicalNumberOfRows()==0){
									rindex = 0 ;
								} else {
									rindex = hfsheet.getLastRowNum()+1 ;
								}
							}
							HSSFRow hfrow = hfsheet.createRow(rindex) ;   //创建行
							List<Element> celllist = row.elements("cell") ;
							int currentIndex = 0 ;
							for(int c=0;c<celllist.size();c++)  {
								Element cell = celllist.get(c)  ;
								String cellIndex = cell.attributeValue("index") ; //列号
								String cellType = cell.attributeValue("type") ; //类型
								String cellValue = cell.getText() ;
								HashMap cmap = new HashMap() ;
								Iterator kit = rmap.keySet().iterator() ;
								while(kit.hasNext()) {
									Object key = kit.next() ;
									cmap.put(key, rmap.get(key)) ;
								}
								
								//列水平对齐方式
								if(c<alignList.size()&&alignList.get(c)!=null) {
									cmap.put("alignment", alignList.get(c)) ;
								}
								
								//相关属性
								Iterator cit = cell.attributeIterator() ;
								while(cit.hasNext()) {
									Attribute attribute = (Attribute)cit.next() ;
									String attributeName = attribute.getName() ;
									if(attributeName.equals("index")||attributeName.equals("type")) {
										continue ;
									} else {
										if(cmap.containsKey(attributeName)) {
											cmap.remove(attributeName) ;
										}
										cmap.put(attributeName,attribute.getText()) ;
									}
								}
								
								int cindex = currentIndex ;
								if(cellIndex!=null)  {
									cindex = Integer.parseInt(cellIndex) ;
								} 
								currentIndex = cindex+1 ;
								HSSFCell hfcell = hfrow.createCell(cindex) ;//创建cell
								//给单元格赋值
								setCellValue(hfcell,cellType==null?((typeList.size()<=cindex||typeList.get(cindex)==null)?"string":typeList.get(cindex).toString()):cellType,cellValue) ;
								//设置单元格样式
								hfcell.setCellStyle(getConfigStyle(hfwb,stylesMap,cmap)) ;
								
								//处理合并单元格
								String value = hfcell.toString() ;
								if(value.equals("#cspan"))  {   //合并列处理
									hfsheet.addMergedRegion(new Region(rindex, (short)(cindex-1), rindex, (short)cindex)); 
								} else if(value.equals("#rspan")) {  //合并行处理
									hfsheet.addMergedRegion(new Region(rindex-1, (short)cindex, rindex, (short)cindex));
								}
							}
						}
						//设置sheet页名称
						if(sheetname!=null) {
							int sheetIx = hfwb.getSheetIndex(hfsheet) ;
							hfwb.setSheetName(sheetIx, sheetname) ;
						}
						//设置列宽
						for(int i=0;i<widthList.size();i++) {
							double width = Double.valueOf(widthList.get(i).toString()).doubleValue()*258 ;
							if(width>0) {
								hfsheet.setColumnWidth(i, (short)width) ;
							} else if(width==0) {
								hfsheet.setColumnHidden(i, true) ;
							} else {  //poi没有删除列的方法
								hfsheet.setColumnHidden(i, true) ;
							}
						}
					}
					//删除模板页
					for(int i=0;i<templateSheetNames.size();i++) {
						hfwb.removeSheetAt(hfwb.getSheetIndex(templateSheetNames.get(i))) ;
					}
				}
				file_lsh +="`"+hSSFWorkbookToDb(hfwb,wbname) ;
			}
		} catch (DocumentException e) {
			e.printStackTrace();
		}
		if(file_lsh.length()>0)  file_lsh = file_lsh.substring(1) ;
		return file_lsh ;
	}
	
	/**
	 * 转换水平对齐方式
	 * @param align
	 * @return 
	 */
	private int tranAlign(String align) {
		int retInt = HSSFCellStyle.ALIGN_RIGHT ;
		if(align.equals("center")) {
			retInt = HSSFCellStyle.ALIGN_CENTER ;
		} else if(align.equals("left")) {
			retInt = HSSFCellStyle.ALIGN_LEFT ;
		} else if(align.equals("right")) {
			retInt = HSSFCellStyle.ALIGN_RIGHT ;
		} 
		return retInt;
	}

	/**
	 * 设置初始样式表
	 * @param HSSFWorkbook wb 
	 * @param HashMap stylesMap
	 */
	private HSSFCellStyle getConfigStyle(HSSFWorkbook wb, HashMap<String,HSSFCellStyle> stylesMap,HashMap ctstyleMap) {
		String fontName = ctstyleMap.containsKey("fontName")?ctstyleMap.get("fontName").toString():"宋体"  ;
		int fontSize = ctstyleMap.containsKey("fontSize")?Integer.parseInt(ctstyleMap.get("fontSize").toString()):10 ;
		short fontBold = ctstyleMap.containsKey("fontBold")?Short.valueOf(ctstyleMap.get("fontSize").toString()).shortValue():HSSFFont.BOLDWEIGHT_NORMAL ;
		boolean fontItalic = ctstyleMap.containsKey("fontItalic")?Boolean.parseBoolean(ctstyleMap.get("fontItalic").toString()):false ;
		boolean wrapText = ctstyleMap.containsKey("wrapText")?Boolean.parseBoolean(ctstyleMap.get("wrapText").toString()):true ;
		short alignment = ctstyleMap.containsKey("alignment")?Short.valueOf(ctstyleMap.get("alignment").toString()).shortValue():HSSFCellStyle.ALIGN_RIGHT ;
		short verticalAlignment = ctstyleMap.containsKey("verticalAlignment")?Short.valueOf(ctstyleMap.get("verticalAlignment").toString()).shortValue():HSSFCellStyle.VERTICAL_CENTER ;
		short bottomBorder = ctstyleMap.containsKey("bottomBorder")?Short.valueOf(ctstyleMap.get("bottomBorder").toString()).shortValue():HSSFCellStyle.BORDER_THIN ;
		short topBorder = ctstyleMap.containsKey("topBorder")?Short.valueOf(ctstyleMap.get("topBorder").toString()).shortValue():HSSFCellStyle.BORDER_THIN ;
		short leftBorder = ctstyleMap.containsKey("leftBorder")?Short.valueOf(ctstyleMap.get("leftBorder").toString()).shortValue():HSSFCellStyle.BORDER_THIN ;
		short rightBorder = ctstyleMap.containsKey("rightBorder")?Short.valueOf(ctstyleMap.get("rightBorder").toString()).shortValue():HSSFCellStyle.BORDER_THIN ;
		String key = fontName+"`"+fontSize+"`"+fontBold+"`"+fontItalic+"`"+wrapText+"`"+alignment+"`"+verticalAlignment+"`"+bottomBorder+"`"+topBorder+"`"+leftBorder+"`"+rightBorder ;
		HSSFCellStyle cellStyle = null ;
		if(stylesMap.containsKey(key)) {
			cellStyle = stylesMap.get(key) ;
		} else {
			cellStyle = createCellStyle(wb,fontName,fontSize,fontBold,fontItalic,wrapText,alignment,verticalAlignment,bottomBorder,topBorder,leftBorder,rightBorder) ;
			stylesMap.put(key, cellStyle) ;
		}
		return cellStyle ;
	}

	/**
	 * 根据单元格类型给单元格赋值
	 * @param HSSFCell hfcell
	 * @param String cellType
	 * @param String cellValue
	 */
	private void setCellValue(HSSFCell hfcell, String cellType, String cellValue) {
		String cell = cellType.trim().toLowerCase() ;
		if(cell.equals("boolean")) {  //真假值
			boolean value = new Boolean(cellValue).booleanValue() ;
			hfcell.setCellValue(value) ;
		} else if(cell.equals("calendar")){
			if(cellValue!=null&&!cellValue.equals("")) {
				Calendar value=new GregorianCalendar();
				Date d=null;
				SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");
				sdf.setTimeZone(TimeZone.getTimeZone("GMT+8"));
				try {
					d = sdf.parse(cellValue);
				} catch (ParseException e) {
					e.printStackTrace();
				}  
				value.setTime(d); 
				hfcell.setCellValue(value) ;
			}
		} else if(cell.equals("date")){
			Date value = null ;
			if(cellValue!=null&&!cellValue.equals("")) {
				DateFormat format = new SimpleDateFormat("MM/dd/yyyy");   
				format.setTimeZone(TimeZone.getTimeZone("GMT+8"));
				try {
					value = format.parse(cellValue) ;
				} catch (ParseException e) {
					e.printStackTrace();
				}
			}
			if(value!=null) hfcell.setCellValue(value) ;
		} else if(cell.equals("number")){
			if(cellValue!=null&&!cellValue.equals("")) {
				if(!isNum(cellValue)) {
					HSSFRichTextString value = new HSSFRichTextString(cellValue) ;
					hfcell.setCellValue(value) ;
				} else {
					double value = Double.valueOf(cellValue).doubleValue() ;
					hfcell.setCellValue(value) ;
				}
			}
		} else {
			HSSFRichTextString value = new HSSFRichTextString(cellValue) ;
			hfcell.setCellValue(value) ;
		}
	}
	
	//判断字符串是否可转换成数字
	public static boolean isNum(String p_str) {
		if(p_str.matches("^[-]?\\d*[.]?\\d*$") && !p_str.equals("-")) {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * 通过文件号获得大对象的输入流(提供给poi操作)
	 * @param Stirng file_lsh
	 * @return InputStream
	 */
	private InputStream getExcelStream(String file_lsh) {
		InputStream  ins = null ;
		ins = this.applicationmgm.getFileInputStream(this.applicationmgm.getFile(file_lsh)) ;
		return ins;
	}
	
	/**
	 * 保存HSSFWorkbook对象成excel大对象到数据库(直接插入一条记录)
	 * @param wb HSSFWorkbook
	 * @param file_lsh String 
	 * @param filename String
	 * @param file_exit boolean
	 * @return file_lsh String
	 */
	public String hSSFWorkbookToDb(HSSFWorkbook wb ,String filename) {
		String file_lsh = null ;
		int size = 0 ;
		ByteArrayOutputStream bos = new ByteArrayOutputStream() ;
		try {
			wb.write(bos) ;
		} catch (IOException e) {
			e.printStackTrace();
		}
		size = bos.size() ;
		InputStream ins = new ByteArrayInputStream(bos.toByteArray()) ;
		try {
			bos.close() ;
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		try {
			//信息表
			AppFileinfo fileinfo = new AppFileinfo(filename,Constant.FILESOURCE, "application/vnd.ms-excel", "0",DateUtil.getSystemDateTime(),Long.valueOf(size+""),"test");
			file_lsh = this.baseDao.insert(fileinfo); 
			this.baseDao.updateBlob(file_lsh, ins, size, true) ;
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return file_lsh;
	}
	
	/**
	 * 删除文件
	 * @param fileid 文件id
	 * @return
	 */
	public boolean deleteTempFile(String fileid) {
		this.applicationmgm.deleteFile(fileid) ;
		return true;
	}
	
	
	private static HSSFCellStyle createCellStyle(HSSFWorkbook wb,String fontName,int fontSize,short fontBold,boolean ifItalic,
			boolean ifWrapText,short alignment,short verticalAlignment,short BorderBottom,short BorderTop,short BorderLeft,short BorderRight){
		HSSFFont font = wb.createFont();    
		font.setFontHeightInPoints((short)fontSize);  
		font.setFontName(fontName);  
		font.setBoldweight(fontBold);
		font.setItalic(ifItalic);
		HSSFCellStyle styleCell = wb.createCellStyle();
		styleCell.setFont(font);
		styleCell.setAlignment(alignment);
		styleCell.setVerticalAlignment(verticalAlignment);
		styleCell.setWrapText(ifWrapText);
		styleCell.setBorderBottom(BorderBottom);
		styleCell.setBorderTop(BorderTop);
		styleCell.setBorderLeft(BorderLeft);
		styleCell.setBorderRight(BorderRight);
		return styleCell;	
	 }
}
