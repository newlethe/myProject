package com.sgepit.frame.util;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;

import jxl.Workbook;
import jxl.write.Border;
import jxl.write.BorderLineStyle;
import jxl.write.Colour;
import jxl.write.Label;
import jxl.write.WritableCellFormat;
import jxl.write.WritableFont;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import jxl.write.WriteException;
import jxl.write.biff.RowsExceededException;

public class JXLUtil {

	/**
	 * 写excel文件
	 * 
	 */
	public static File writeExc(File filename, String[] titleList, String[] dataList) {
		WritableWorkbook wwb = null;
		try {
			wwb = Workbook.createWorkbook(filename);
		} catch (Exception e) {
			e.printStackTrace();
		}
		// 创建Excel工作表
		WritableSheet ws = wwb.createSheet("Excel导出", 0);// 创建sheet
		try {
//			ws.mergeCells(0, 0, 2, 1);// 合并单元格(左列，左行，右列，右行)从第1行第1列到第2行第3列
//			Label header = new Label(0, 0, "通讯录(191026班)", getHeader());
//			ws.addCell(header);// 写入头
			Label l;
			for (int i = 0; i < titleList.length; i++) {
				//
				try {
					String title = new String(titleList[i].getBytes("ISO8859-1"), "UTF-8");
					l = new Label(i, 0, title, getTitle());
					ws.addCell(l);
					ws.setColumnView(i, 20);
					ws.setRowView(2, 400);
				} catch (UnsupportedEncodingException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				
			}
			for (int x = 0; x < dataList.length; x++) {
				String[] cellData = dataList[x].split(",");
				for (int y = 0; y < cellData.length; y++) {
					try {
						String cellDataStr = new String(cellData[y].getBytes("ISO8859-1"), "UTF-8");
						l = new Label(y, x+1, cellDataStr, getNormolCell());
						ws.addCell(l);
					} catch (UnsupportedEncodingException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					
				}
			}
//			Label l = new Label(0, 2, "姓名", getTitle());// 第3行
//			ws.addCell(l);
//			l = new Label(1, 2, "电话", getTitle());
//			ws.addCell(l);
//			l = new Label(2, 2, "地址", getTitle());
//			ws.addCell(l);
//			l = new Label(0, 3, "小祝", getNormolCell());// 第4行
//			ws.addCell(l);
//			l = new Label(1, 3, "1314***0974", getNormolCell());
//			ws.addCell(l);
//			l = new Label(2, 3, "武汉武昌", getNormolCell());
//			ws.addCell(l);
//			l = new Label(0, 4, "小施", getNormolCell());// 第5行
//			ws.addCell(l);
//			l = new Label(1, 4, "1347***5057", getNormolCell());
//			ws.addCell(l);
//			l = new Label(2, 4, "武汉武昌", getNormolCell());
//			ws.addCell(l);
//			ws.setColumnView(0, 20);// 设置列宽
//			ws.setColumnView(1, 20);
//			ws.setColumnView(2, 40);
//			ws.setRowView(0, 400);// 设置行高
//			ws.setRowView(1, 400);
//			ws.setRowView(2, 500);
//			ws.setRowView(3, 500);
//			ws.setRowView(4, 500);
		} catch (RowsExceededException e1) {
			e1.printStackTrace();
		} catch (WriteException e1) {
			e1.printStackTrace();
		}

		// 输出流
		try {
			wwb.write();
		} catch (IOException ex) {
			// TODO 自动生成 catch 块
			ex.printStackTrace();
		}
		// 关闭流
		try {
			wwb.close();
		} catch (WriteException ex) {
			// TODO 自动生成 catch 块
			ex.printStackTrace();
		} catch (IOException ex) {
			// TODO 自动生成 catch 块
			ex.printStackTrace();
		}
		// outStream.close();
		System.out.println("写入成功！ ");
		return filename;
	}

	/**
	 * 设置头的样式
	 * 
	 * @return
	 */
	public static WritableCellFormat getHeader() {
		WritableFont font = new WritableFont(WritableFont.TIMES, 24,
				WritableFont.BOLD);// 定义字体
		try {
			font.setColour(Colour.BLUE);// 蓝色字体
		} catch (WriteException e1) {
			// TODO 自动生成 catch 块
			e1.printStackTrace();
		}
		WritableCellFormat format = new WritableCellFormat(font);
		try {
			format.setAlignment(jxl.format.Alignment.CENTRE);// 左右居中
			format.setVerticalAlignment(jxl.format.VerticalAlignment.CENTRE);// 上下居中
			format.setBorder(Border.ALL, BorderLineStyle.THIN, Colour.BLACK);// 黑色边框
			format.setBackground(Colour.YELLOW);// 黄色背景
		} catch (WriteException e) {
			// TODO 自动生成 catch 块
			e.printStackTrace();
		}
		return format;
	}

	/**
	 * 设置标题样式
	 * 
	 * @return
	 */
	public static WritableCellFormat getTitle() {
		WritableFont font = new WritableFont(WritableFont.TIMES, 14, WritableFont.BOLD);
		try {
			font.setColour(Colour.BLACK);// 黑色字体
		} catch (WriteException e1) {
			// TODO 自动生成 catch 块
			e1.printStackTrace();
		}
		WritableCellFormat format = new WritableCellFormat(font);

		try {
			format.setAlignment(jxl.format.Alignment.CENTRE);
			format.setVerticalAlignment(jxl.format.VerticalAlignment.CENTRE);
			format.setBorder(Border.ALL, BorderLineStyle.THIN, Colour.BLACK);
			format.setBackground(Colour.GRAY_25);
		} catch (WriteException e) {
			// TODO 自动生成 catch 块
			e.printStackTrace();
		}
		return format;
	}

	/**
	 * 设置其他单元格样式
	 * 
	 * @return
	 */
	public static WritableCellFormat getNormolCell() {// 12号字体,上下左右居中,带黑色边框
		WritableFont font = new WritableFont(WritableFont.TIMES, 12);
		WritableCellFormat format = new WritableCellFormat(font);
		try {
			format.setAlignment(jxl.format.Alignment.CENTRE);
			format.setVerticalAlignment(jxl.format.VerticalAlignment.CENTRE);
			format.setBorder(Border.ALL, BorderLineStyle.THIN, Colour.BLACK);
		} catch (WriteException e) {
			// TODO 自动生成 catch 块
			e.printStackTrace();
		}
		return format;
	}

}
