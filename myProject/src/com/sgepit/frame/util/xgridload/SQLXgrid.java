package com.sgepit.frame.util.xgridload;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Types;
import java.util.ArrayList;
import java.util.HashMap;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import com.sgepit.frame.util.JNDIUtil;

public class SQLXgrid {
	/**
	   * 通过sql语句生成xgrid页面
	   * @param sql  sql语句
	   * @param types  列类型
	   * @param widths  宽度
	   * @param combox  下拉框集合
	   * @param widths
	   * @return xml串
	   */
	  public static String getSQLXgrid(String[] header,String sql, String types, String[] combox, String widths) {
		  Document document = DocumentHelper.createDocument();	
		  Element rows = document.addElement("rows") ;
		  try {
				HashMap<String,String> typemap = new HashMap<String,String>()  ;
				HashMap<String,String> widthmap = new HashMap<String,String>()  ;
				HashMap<String,String> comboxmap = new HashMap<String,String>()  ;
				//取出表头第一行放到数组中
				ArrayList<String> firstHead = new ArrayList<String>() ;
				if(header!=null&&header.length>0) {
					String[] headerFirstSplit = header[0].split("[,]") ;
					for(int i=0;i<headerFirstSplit.length;i++)  {
						firstHead.add(headerFirstSplit[i]) ;
					}
				}
				
				//将类型放到map中
				if(!types.equals(""))  {
					String[] type = types.split("[,]") ;
					for(int i=0;i<type.length;i++)  {
						if(!type[i].trim().equals(""))  {
							typemap.put(i+1+"", type[i]) ;
						}
					}
				}
				//将宽度放到map中
				if(!widths.equals(""))  {
					String[] width = widths.split("[,]") ;
					for(int i=0;i<width.length;i++)  {
						widthmap.put(i+1+"", width[i]) ;
					}
				}
				//将下拉框放到map中(放字符串，在生成xml的时候处理)
				for(int i=0;i<combox.length;i++)  {
					if(combox[i]!=null)  {
						comboxmap.put(i+1+"", combox[i]) ;
					}
				}
				
				Context initCtx = new InitialContext();
				DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
				Connection conn = ds.getConnection();
				Statement stmt = conn.createStatement();
				ResultSet rs = stmt.executeQuery(sql);
				
				//生成表头
				Element head= rows.addElement("head") ;
				ResultSetMetaData rsmd = rs.getMetaData();
				int colslength = rsmd.getColumnCount() ;
				for(int i=1;i<rsmd.getColumnCount();i++){
					//增加列及属性
					Element column= head.addElement("column") ;
					if(header==null)  {
						column.addCDATA(rsmd.getColumnName(i)) ;  //列名
					} else {
						if(firstHead.size()>i-1) {
							column.addCDATA(firstHead.get(i-1)) ;
						}
					}
					column.addAttribute("width",widthmap.containsKey(i+"")?widthmap.get(i+""):"100") ;  //列宽
					column.addAttribute("type",typemap.containsKey(i+"")?typemap.get(i+""):getDataType(rsmd.getColumnType(i),rsmd.getScale(i),rsmd.getPrecision(i),null)) ;  //列宽
					column.addAttribute("align",getOrderType(rsmd.getColumnType(i),rsmd.getPrecision(i)));
					column.addAttribute("sort",getSortType(rsmd.getColumnType(i),rsmd.getPrecision(i)));
					if(comboxmap.containsKey(i+""))  {   //如果有下拉框
						column.setAttributeValue("type", "co") ;
						String[] comboxs = comboxmap.get(i+"").split("[,]") ;
						for(int k=0;k<comboxs.length/2;k++)  {
							Element option= column.addElement("option") ;
							option.addAttribute("value", comboxs[2*k]) ;
							option.addCDATA(comboxs[2*k+1]) ;
						}
					}
				}
				if(header!=null&&header.length>1) {
					for(int i=1;i<header.length;i++)  {
						Element afterInit= head.addElement("afterInit") ;
						Element call= afterInit.addElement("call") ;
						call.addAttribute("command", "attachHeader") ;
						Element param= call.addElement("param") ;
						param.addCDATA(header[i]) ;
					}
				}
				//生成数据内容
				while(rs.next())  {
					Element row= rows.addElement("row") ;
					row.addAttribute("id", rs.getString(colslength))  ;
					for(int c=1 ;c<colslength;c++)  {
						Element cell= row.addElement("cell") ;
						cell.addCDATA(rs.getString(c))  ;
					}
				}
				rs.close() ;
				stmt.close();
				conn.close();
				initCtx.close();
			} catch (NamingException e) {
				e.printStackTrace();
			} catch (SQLException e) {
				e.printStackTrace();
			}
//		  System.out.println(document.asXML()) ;
		  return document.asXML().toString();
		}
	  
	    private   static   String   getDataType(int   type,int   scale, int precision,String closextend){  
	          String   dataType="";  
	          if(closextend!=null&&!closextend.equals("")&&closextend.split("[`]").length>1)  {
	        	  dataType = closextend.split("[`]")[1] ;
	          } else {
	                  switch(type){  
	                          case   Types.LONGVARCHAR:   //-1  
	                          dataType="txt";  
	                          break;  
	                  case   Types.CHAR:         //1  
	                          dataType="ed";  
	                          break;  
	                  case   Types.NUMERIC:   //2  
	                          switch(scale){  
	                                  case   0:  
	                                          dataType="ed";  
	                                          break;  
	                                  case   -127:  
	                                          dataType="ed";  
	                                          break;  
	                                  default:  
	                                          dataType="ed";  
	                          }  
	                          break;  
	                  case   Types.VARCHAR:     //12  
	                	     if(precision>60)  {
	                	    	 dataType = "txt" ; 
	                           } else {
	                        	 dataType = "ed" ; 
	                           }
	                           break; 
	                  case   Types.DATE:     //91  
	                          dataType="calendar";   //日期型
	                          break;  
	                  case   Types.TIMESTAMP:   //93  
	                          dataType="ed";  
	                          break;  
	                  default: 
	                          dataType="ed";  
	             }  
	         }
	          //dataType = "ed" ;
	          return   dataType;  
	} 
	 
	//判断排序类型 
	 private static String getOrderType(int columnType, int precision) {
		  String OrderType = "";
		  switch(columnType){
		        case   Types.NUMERIC:   //2  
		        	   OrderType = "right" ;
		        	   break;
		        case   Types.LONGVARCHAR:   //-1 
		        	   OrderType = "left" ; 
		        	   break;
		        case   Types.VARCHAR:     //12  
	                   if(precision>200)  {
	                	   OrderType = "left" ; 
	                   } else {
	                	   OrderType = "center" ; 
	                   }
	                   break;  
		        default:  
		        	OrderType="center"; 
		  }
		  return OrderType;
	  }
	 
	//判断排序类型 
	 private static String getSortType(int columnType, int precision) {
		 String sortType = "";
		 switch(columnType){
		 case   Types.NUMERIC:   //2  
			    sortType = "int" ;
			    break;
		 default:  
			 sortType="str"; 
		 }
		 return sortType;
	 }
}