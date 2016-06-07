package com.sgepit.pmis.rlzj.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections.map.ListOrderedMap;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.jdom.JDOMException;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.sysman.hbm.AppFileinfo;
import com.sgepit.frame.sysman.service.ApplicationMgmFacade;
import com.sgepit.frame.util.DateUtil;
import com.sgepit.frame.util.JdbcUtil;


public class XgridBean {
	
	public static final String COL_CONFIG = "CONF:COL_CONFIG";
	
	private BaseDAO baseDao;
	private ApplicationMgmFacade applicationmgm;
	
	public XgridBean() {
		this.applicationmgm = (ApplicationMgmFacade) Constant.wact.getBean("applicationMgm");
		this.baseDao = (BaseDAO) Constant.wact.getBean("baseDAO");
	}
	
	
	/**
	 * 根据选择的模板ID，用户ID，获取工资单数据的XML；
	 * @param templateId
	 * @param userIDs
	 * @param reportId
	 * @return
	 * @author: Liuay
	 * @throws DocumentException 
	 * @throws JDOMException 
	 * @createDate: Jun 20, 2011
	 */
	public String getXgridXML(String templateId, String userIDs, String reportId, String sjType, String readOnly) throws DocumentException, JDOMException {
		String header = getHeader(templateId) ;
		XgridXML xgridXML = new XgridXML();
		
		//从模板选择人员
		if(userIDs == null || userIDs.length()==0) {
			List list = null;
			String sql1 = "select distinct userid from HR_SALARY_DETAIL WHERE REPORT_ID='" + reportId + "'";
			List l1 = JdbcUtil.query(sql1);
			if (l1.size()>0) {
				list = l1;
			} else {
				String sql = "select distinct userid from HR_SALARY_TEMPLATE_USER where template_id ='" + templateId + "'";
				List l = JdbcUtil.query(sql);
				list=l;
			}
			
			userIDs = "";
			if (list!=null && list.size()>0) {
				for (int i = 0; i < list.size(); i++) {
					String userid = ((Map<String, String>)list.get(i)).get("userid");
					userIDs += "`" + userid;
				}
				if (userIDs.length()>0) {
					userIDs = userIDs.substring(1);
				}
			}
		} 
		
		String returnXml = xgridXML.getXgridXMLByHeader(header, userIDs, sjType, readOnly);
		return returnXml;
	}
	
	/**
	 * 根据模板ID，编辑的数据XML,保存xgrid数据信息
	 * @param templateId
	 * @param dataXml
	 * @return
	 * @author: Liuay
	 * @throws DocumentException 
	 * @createDate: Jun 21, 2011
	 */
	public String saveXgrid(String templateId, String dataXml) throws DocumentException {
		String header = getHeader(templateId) ;
		XgridXML xgridXML = new XgridXML();
		String returnXml = xgridXML.saveXgridXMLByHeader(header, dataXml);
		return returnXml;
	}

	/**
	 * 根据模板ID获取Xgrid表头
	 * @param templateId
	 * @return
	 * @author: Liuay
	 * @createDate: Jun 20, 2011
	 */
	private String getHeader(String templateId) {
		String returnStr = null ;
		String sql = "select xgrid_title from hr_salary_template where uids = '" + templateId + "'" ;
		List<ListOrderedMap> list = JdbcUtil.query(sql);
		if(list.size()>0) {
			ListOrderedMap map = list.get(0) ;
			returnStr = map.getValue(0)==null?"":map.getValue(0).toString() ;
		}
		return returnStr;
	}
	
	/** 数据导出 ****************************************************************************/
	/**
	 * 将模板的表头生成Excel文件
	 * @param businessId 模板uids
	 * @param xml
	 * @return
	 * @author: Liuay
	 * @createDate: Jun 29, 2011
	 */
	public String headerXMLStringToExcel(String businessId, String xml) {
		String file_lsh = "" ;
		if(xml==null || xml.trim().length()<=1) {
			return "-1";
		}
		
		try {
			Document headerDoc = DocumentHelper.parseText(xml) ;
			String fileName = "template["+businessId+"]" + ".xls";
			
			Workbook hfwb = new HSSFWorkbook() ;
			//创建sheet页
			Sheet hfsheet = hfwb.createSheet("businessId") ;
			hfsheet.setDefaultColumnWidth(20);
			hfsheet.setDefaultRowHeight((short)8);
			Row hfrow = hfsheet.createRow(0) ;   //创建行
			Row hiddenRow = hfsheet.createRow(1) ;   //创建行
			hiddenRow.setHeight((short) 0);
			
			 // 设置字体   
		    Font headfont = hfwb.createFont();   
		    headfont.setFontName("黑体");   
		    headfont.setFontHeightInPoints((short) 14);// 字体大小   
		    headfont.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);// 加粗   
		    // 标题行的样式
		    CellStyle headstyle = hfwb.createCellStyle();   
		    headstyle.setFont(headfont);   
		    headstyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);// 左右居中   
		    headstyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);// 上下居中   
		    headstyle.setLocked(true);   
		    headstyle.setWrapText(true);// 自动换行   
		    short borderHeight = (short)2;
		    headstyle.setBorderBottom(borderHeight);
		    headstyle.setBorderLeft(borderHeight);
		    headstyle.setBorderRight(borderHeight);
		    headstyle.setBorderTop(borderHeight);
		    
		    //在列配置行的第一个单元格写下标识，并隐藏第一列
		    Cell hiddenRowCelConf = hiddenRow.createCell(0);
		    hiddenRowCelConf.setCellValue(COL_CONFIG);
		    hfsheet.setColumnHidden(0, true);
			
			List<Element> colList = headerDoc.selectNodes("/rows/head/column");
			for (int i = 0; i < colList.size(); i++) {
				Element colEl = colList.get(i);
				String configStr = colEl.asXML().toString();
				String colHidden = colEl.attributeValue("hidden");
				String headerName = colEl.getText();
				
				int excelCol = i + 1;
				//设置列隐藏
				if (colHidden!=null && colHidden.equals("true")) {
					hfsheet.setColumnHidden(excelCol, true);
				}
				
				//隐藏标题行的下一行为列配置
				Cell hiddenRowCell = hiddenRow.createCell(excelCol);
				hiddenRowCell.setCellValue(configStr);
				
				Cell hfcell = hfrow.createCell(excelCol) ;//创建cell
				//给单元格赋值
				hfcell.setCellValue(headerName) ;
				hfcell.setCellStyle(headstyle);
			}
			
			file_lsh = hSSFWorkbookToDb(hfwb, businessId, fileName) ;
		} catch (DocumentException e) {
			e.printStackTrace();
		}
		return file_lsh ;
	}

	/**
	 * 保存HSSFWorkbook对象成excel大对象到数据库(直接插入一条记录)
	 * @param wb HSSFWorkbook
	 * @param file_lsh String 
	 * @param filename String
	 * @param file_exit boolean
	 * @return file_lsh String
	 */
	private String hSSFWorkbookToDb(Workbook wb ,String businessId, String filename) {
		//先删除已经存在的模板Excel大对象
		this.deleteTemplateBlob(businessId);
		
		String file_lsh = "-1" ;
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
			AppFileinfo fileinfo = new AppFileinfo(filename,Constant.FILESOURCE, "application/vnd.ms-excel", "0", DateUtil.getSystemDateTime(), Long.valueOf(size+""), businessId);
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
	 * 用POI 导出工资单数据到 工资单模板中；
	 * @param templateId
	 * @param xmlData
	 * @return
	 * @author: Liuay
	 * @createDate: Jun 30, 2011
	 */
	public ByteArrayOutputStream exportDataToExcel(String templateId, String dataXml) {
		String selectSql = "select fileid from app_fileinfo where businessid='" + templateId + "'";
		List<Map<String, String>> list = JdbcUtil.query(selectSql);
		String excelFileId = "";
		if (list.size()==1) {
			excelFileId = list.get(0).get("fileid");
		}
		try {
			Workbook wb = null;
			AppFileinfo file = this.applicationmgm.getFile(excelFileId);
			if (file != null) {
				InputStream is = this.applicationmgm.getFileInputStream(file);
				InputStream is1 = this.applicationmgm.getFileInputStream(file);
				if (is == null) {
					System.out.println("模板文件为NULL");
				} else {
			        try {
			            wb = new HSSFWorkbook(is);
			            is.close();
			        } catch (Exception ex) {
			        		is.close();
			        		wb = new XSSFWorkbook(is1);
			        		is1.close();
			        }
				}
			} else {
				System.out.println("模板文件为不存在");
			}
		
			if (wb!=null) {
				Sheet hfsheet = wb.getSheetAt(0);
				int templateRowNum = hfsheet.getLastRowNum();
				
//				数据写入的开始行
				int rowIndex = 2;
				int beginColIndex = 0;
				int defaultRowHeight = 6;
				
				for (int i = 0; i <= templateRowNum; i++) {
					Row templateRow = hfsheet.getRow(i);
					Cell firstCell = templateRow.getCell(0);
					if (firstCell!=null) {
						String text = firstCell.getStringCellValue();
						if (text!=null && text.equals(COL_CONFIG)) {
							rowIndex = i+1;
							beginColIndex = 1;
							break;
						}
					}
				}
				
//				获取代码格式的转义
				Row configRow = hfsheet.getRow(rowIndex-1);
				Map<String, List<Element>> optionMap = new HashMap<String, List<Element>>();
				for (int i = beginColIndex; i <= configRow.getLastCellNum(); i++) {
					Cell configCell = configRow.getCell(i);
					if (configCell!=null) {
						String text = configCell.getStringCellValue();
						if (text!=null && text.indexOf("type=\"co\"")>-1 && text.indexOf("<option")>-1) {
							Document cellEl = DocumentHelper.parseText(text);
							Element colEl = cellEl.getRootElement();
							List<Element> options =  colEl.selectNodes("/column/option");
							if (options!=null && options.size()>0) {
								optionMap.put(String.valueOf(i), options);
							}
						}
					}
				}
				
				//读取模板数据开始行的样式，用于后面行写入时的样式
				Row beginRow = hfsheet.getRow(rowIndex);
				Map<String, CellStyle> styleMap = new HashMap<String, CellStyle>();
				if (beginRow!=null) {
					defaultRowHeight = beginRow.getHeight();
					Iterator<Cell> cellIter = beginRow.cellIterator();
					while (cellIter.hasNext()) {
						Cell cell1 = cellIter.next();
						int colInd = cell1.getColumnIndex();
						CellStyle style = cell1.getCellStyle();
						styleMap.put(String.valueOf(colInd), style);
					}
				}
				
				if (dataXml!=null && dataXml.length()>0 && wb!=null) {
					Document dataDoc = DocumentHelper.parseText(dataXml);
					List<Element> dataList = dataDoc.selectNodes("/rows/row");
					
					//------默认样式
					 // 设置字体   
				    Font defaultfont = wb.createFont();   
				    defaultfont.setFontName("宋体");   
				    defaultfont.setFontHeightInPoints((short) 12);// 字体大小   

				    CellStyle defaultstyle = wb.createCellStyle();   
				    defaultstyle.setFont(defaultfont);   
				    defaultstyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);// 左右居中   
				    defaultstyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);// 上下居中   
				    defaultstyle.setLocked(true);   
				    defaultstyle.setWrapText(true);// 自动换行   
				    short borderHeight = (short)1;
				    defaultstyle.setBorderBottom(borderHeight);
				    defaultstyle.setBorderLeft(borderHeight);
				    defaultstyle.setBorderRight(borderHeight);
				    defaultstyle.setBorderTop(borderHeight);
					
					for(Iterator<Element> it = dataList.iterator();it.hasNext();) {
						Element row = (Element) it.next();
						Row hfrow = hfsheet.createRow(rowIndex) ;   //创建行
//						hfrow.setHeight((short)defaultRowHeight);
						List<Element> cellList = row.elements("cell");
						int colIndex = beginColIndex;
						for(Iterator<Element> cellIt = cellList.iterator(); cellIt.hasNext();) {
							Element cell = (Element) cellIt.next();
							Cell hscell = hfrow.createCell(colIndex);
							hscell.setCellValue(cell.getText());
							
							String colKey = String.valueOf(colIndex);
							if (optionMap.containsKey(colKey)) {
								List<Element> opList = optionMap.get(colKey);
								for (int i = 0; i < opList.size(); i++) {
									Element opEl = opList.get(i);
									if (opEl.attributeValue("value").equals(cell.getText())) {
										hscell.setCellValue(opEl.getText());
										break;
									}
								}
							}
							
							if (styleMap.containsKey(String.valueOf(colIndex))) {
								hscell.setCellStyle(styleMap.get(String.valueOf(colIndex)));
							} else {
								hscell.setCellStyle(defaultstyle);
							}
							colIndex ++;
						}
						rowIndex ++ ;
					}
				}
				
				ByteArrayOutputStream bos = new ByteArrayOutputStream() ;
				try {
					wb.write(bos) ;
				} catch (IOException e) {
					e.printStackTrace();
				}
				return bos;
			} else {
				System.out.println("模板加载错误");
			}
		} catch (DocumentException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 删除工资单导出模板的大对象信息
	 * @param templateId
	 * @return
	 * @author: Liuay
	 * @createDate: Jul 1, 2011
	 */
	public String deleteTemplateBlob(String templateId) {
		String sql = "select fileId from app_fileinfo where businessid ='" + templateId + "'";
		List<Map<String, String>> list = JdbcUtil.query(sql);
		for (int i = 0; i < list.size(); i++) {
			String fileId = list.get(i).get("fileId");
			this.applicationmgm.deleteFile(fileId);
		}
		return "OK";
	}
}
