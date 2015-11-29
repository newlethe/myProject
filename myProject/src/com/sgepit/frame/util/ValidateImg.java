package com.sgepit.frame.util;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Random;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.sun.image.codec.jpeg.JPEGCodec;
import com.sun.image.codec.jpeg.JPEGImageEncoder;

public class ValidateImg extends HttpServlet {
    
    private static final long serialVersionUID = 200611051357L;
    private static final String CONTENT_TYPE = "image/jpeg"; // 输出的文件格式是jpeg

    // ，关于HTTP输出类型的定义可参考相关文档说明

    private static final int WIDTH = 46;

    private static final int HEIGHT = 18;

    private static final int LENGTH = 4;

    public static final String SESSION_AUTHEN_CODE = "session_authen_code"; // 设置保存的session对象，用户用户提交时进行匹配的操作。

    // Initialize global variables
    public void init() throws ServletException {
    }

    // Process the HTTP Get request
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType(CONTENT_TYPE); // 定义输出的文件格式。
        OutputStream out = response.getOutputStream();
        int width = WIDTH;
        int height = HEIGHT;
        int length = LENGTH;
        String sessionName = request.getParameter("authenName");
        if (sessionName == null) {
            sessionName = SESSION_AUTHEN_CODE;
        }
        try {
            width = Integer.parseInt(request.getParameter("width"));
        } catch (Exception ex) {
            width = WIDTH;
        }
        try {
            height = Integer.parseInt(request.getParameter("heigth"));
        } catch (Exception ex) {
            height = HEIGHT;
        }
        try {
            length = Integer.parseInt(request.getParameter("length"));
        } catch (Exception ex) {
            length = LENGTH;
        }
        // 取得随机整数
        Random ran = new Random(System.currentTimeMillis());
        // 取除第一位后的指定几位
        String seed = (ran.nextInt() + "").substring(1, 1 + length);

        Random random = new Random();
        //String ychar = "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
        String ychar = "0,1,2,3,4,5,6,7,8,9";
        String[] yc = ychar.split(",");// '将字符串生成数组
        int ycodenum = 4;
        seed = "";
        for (int i = 0; i < ycodenum; i++) {
//            seed = seed + yc[random.nextInt(36)]; // 数组一般从0开始读取，所以这里为35*Rnd
            seed = seed + yc[random.nextInt(10)];
        }

        // 将取得的保存在session中
        request.getSession().setAttribute("verifyCode", seed);
        // 生成缓冲图象
        BufferedImage image = new BufferedImage(width, height,
                BufferedImage.TYPE_INT_RGB);
        // 取得绘图对象
        Graphics g = image.getGraphics();
        g.setColor(new Color(245, 245, 245));
        // 填充背景色
        g.fillRect(0, 0, width, height);

        g.setColor(getRandColor(160, 200));

        for (int i = 0; i < 155; i++) {
            int x = random.nextInt(width);
            int y = random.nextInt(height);
            int xl = random.nextInt(12);
            int yl = random.nextInt(12);
            g.drawLine(x, y, x + xl, y + yl);
        }

        // 设置字体颜色
        g.setColor(Color.DARK_GRAY);
        // 设置字体样式
        g.setFont(new Font("Arial", Font.BOLD, 14));
        // 写入指定文字
        g.drawString(seed, 4, 13);
        g.dispose();
        JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(out);
        encoder.encode(image);
        out.close();
    }

    private Color getRandColor(int fc, int bc) {// 给定范围获得随机颜色
        Random random = new Random();
        if (fc > 255)
            fc = 255;
        if (bc > 255)
            bc = 255;
        int r = fc + random.nextInt(bc - fc);
        int g = fc + random.nextInt(bc - fc);
        int b = fc + random.nextInt(bc - fc);
        return new Color(r, g, b);
    }

    // Clean up resources
    public void destroy() {
    }
}